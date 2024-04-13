
type Vector2 = {
  x: number;
  y: number;
}

type Vector3 = {
  x: number;
  y: number;
  z: number;
}

type Polar = {
  r: number;
  theta: number;
}

type Plane = {
  normal: Vector3;
  point: Vector3;
}

namespace Plane {
  export function distance(plane: Plane): number {
    return -Vector3.dot(plane.normal, plane.point);
  }

  export function intersection(a: Plane, b: Plane): { point: Vector3, normal: Vector3 } {
    const normal = Vector3.cross(a.normal, b.normal);

    const c1 = Vector3.cross(a.normal, normal);
    const c2 = Vector3.cross(normal, b.normal);

    const point1 = Vector3.scale(c1, Plane.distance(b));
    const point2 = Vector3.scale(c2, Plane.distance(a));

    const point = Vector3.scale(Vector3.add(point1, point2), 1 / Math.pow(Vector3.magnitude(normal), 2))

    return { point, normal: Vector3.normalize(normal) };
  }
}

namespace Vector2 {
  export const Nan = { x: NaN, y: NaN };

  export function magnitude(a: Vector2): number {
    return Math.sqrt(a.x * a.x + a.y * a.y);
  }

  export function normalize(a: Vector2): Vector2 {
    const mag = magnitude(a);
    return { x: a.x / mag, y: a.y / mag };
  }

  export function invert(a: Vector2): Vector2 {
    return { x: -a.x, y: -a.y };
  }
}

namespace Vector3 {
  export const zero: Vector3 = { x: 0, y: 0, z: 0 };
  export const up: Vector3 = { x: 0, y: 1, z: 0 };
  export const down: Vector3 = { x: 0, y: -1, z: 0 };

  export function add(a: Vector3, b: Vector3): Vector3 {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z
    }
  }

  export function subtract(a: Vector3, b: Vector3): Vector3 {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
      z: a.z - b.z
    }
  }

  export function scale(a: Vector3, b: number): Vector3 {
    return {
      x: a.x * b,
      y: a.y * b,
      z: a.z * b
    }
  }

  export function dot(a: Vector3, b: Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  export function cross(a: Vector3, b: Vector3): Vector3 {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    }
  }

  export function magnitude(a: Vector3): number {
    return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
  }

  export function normalize(a: Vector3): Vector3 {
    const mag = magnitude(a);
    return { x: a.x / mag, y: a.y / mag, z: a.z / mag };
  }

  export function distance(a: Vector3, b: Vector3): number {
    return magnitude(subtract(a, b));
  }
}


export namespace BallisticCalculator {

  /**
   * Проецирует точку на плоскость
   * @param point точка в пространстве
   * @param origin начало координат плоскости
   * @param dir1 направление оси X плоскости
   * @param dir2 направление оси Y плоскости
  */
  function projectPointOnPlane(point: Vector3, origin: Vector3, dir1: Vector3, dir2: Vector3): Vector2 {
    const r_O_point = Vector3.subtract(point, origin);
    const x = Vector3.dot(r_O_point, dir1);
    const y = Vector3.dot(r_O_point, dir2);
    return { x, y };
  }

  /**
   * Переводит координаты из декартовой системы в полярную
  */
  function cartesianToPolar(cartesian: Vector2): Polar {
    return {
      r: Vector2.magnitude(cartesian),
      theta: Math.atan2(cartesian.y, cartesian.x)
    };
  }

  /**
   * Рассчитывает начальную скорость снаряда для попадания в цель относительно начала координат. 2D
   * @param target координаты цели
   * @param g гравитация
   * @param v скорость снаряда
   */
  function calcVelocity(target: Vector2, g: number, v: number): Vector2 {

    const x = target.x;
    const y = target.y;

    let Vy = 0.0;
    if (g == 0) {
      Vy = -v * y * 1.0 / Math.sqrt(x * x + y * y);
    }
    else {
      const inner = Math.max(0, (v * v) * (x * x) + (v * v) * (y * y) * 2.0 - (x * x) * Math.sqrt(v * v * v * v - (g * g) * (x * x) + g * (v * v) * y * 2.0) - g * (x * x) * y)
      Vy = Math.sqrt(2.0) * Math.sqrt(inner / (x * x + y * y)) * (-1.0 / 2.0);
    }

    const Vx = Math.sqrt(v * v - Vy * Vy);

    if (g == 0) return { x: Vx, y: -Vy };

    if (Number.isNaN(Vx) || Number.isNaN(Vy)) throw new Error("Impossible to reach the target. Target is far away");


    const Tx = x / Vx;
    const Ty = -(Vy + Math.sqrt(g * y * 2.0 + Vy * Vy)) / g;


    if (g < 0)
      return { x: Vx, y: Vy * (Math.abs(Tx - Ty) < 1e-6 ? 1 : -1) };

    return { x: Vx, y: Vy * (Math.abs(Tx + Ty) < 1e-6 ? -1 : 1) };

  }

  /**
   * Рассчитывает длину траектории 
   * @param velocity начальная скорость
   * @param g гравитация
   * @param timeFrom время начиная с которого нужно рассчитать длину траектории
   * @param timeTo время до которого нужно рассчитать длину траектории
   */
  function trajectoryLength(velocity: Vector2, g: number, timeFrom: number, timeTo: number) {
    const vY = velocity.y;
    const vX = velocity.x;

    const integral = (t: number) => {
      if (Math.abs(g) < 0.01)
        return t * Math.sqrt(vX * vX + vY * vY);

      const s = Math.sqrt(Math.pow(vY + g * t, 2.0) + vX * vX);
      return ((vY + g * t) * s) /
        (g * 2.0) + ((vX * vX) * Math.log(vY + s + g * t)) /
        (g * 2.0);
    }

    return integral(timeTo) - integral(timeFrom);
  }

  /**
   * Рассчитывает траекторию снаряда в 3д
   * @param target координаты цели
   * @param velocity скорость снаряда
   * @param gravity гравитация
   * @returns 
   * trajectoryVelocity - начальная скорость снаряда
   * trajectoryLength - длина траектории
   * shotTime - время полета снаряда
   * targetNormal - нормаль к поверхности цели
   */
  function createTrajectory(target: Vector3, velocity: number, gravity: number): {
    velocity: Vector3,
    length: number,
    shotTime: number,
    targetNormal: Vector3
  } {

    const x = Vector2.magnitude({ x: target.x, y: target.z });
    const y = target.y;
    const v = calcVelocity({ x, y }, gravity, velocity);

    const shotTime = x / v.x;
    const normal = Vector2.invert(Vector2.normalize({ x: v.x, y: v.y + gravity * shotTime }));

    var targetDir = Vector3.normalize({ x: target.x, y: 0, z: target.z });
    var targetDirCross = Vector3.normalize(Vector3.cross(targetDir, Vector3.down));

    var val3 = projectPointOnPlane({ x: v.x, y: 0, z: 0 }, Vector3.zero, targetDir, targetDirCross);
    var normal3 = projectPointOnPlane({ x: normal.x, y: 0, z: 0 }, Vector3.zero, targetDir, targetDirCross);

    return {
      velocity: { x: val3.x, y: v.y, z: val3.y },
      length: trajectoryLength(v, gravity, 0, shotTime),
      shotTime,
      targetNormal: Vector3.normalize({ x: normal3.x, y: normal.y, z: normal3.y })
    }
  }

  /**
   * Рассчитывает точку пересечения линии и траектории в 2D
   * @param velocity скорость снаряда
   * @param g гравитация
   * @param lineOrigin точка на линии
   * @param lineDirection направление линии
   */
  function intersectLineTrajectory2D(velocity: Vector2, g: number, lineOrigin: Vector2, lineDirection: Vector2): { res1: Vector2, res2: Vector2 } {
    const vY = velocity.y;
    const vX = velocity.x;

    const yS = lineOrigin.y;
    const xS = lineOrigin.x;

    const xK = lineDirection.x;
    const yK = lineDirection.y;

    if (g == 0) {
      const t = (xK * yS - xS * yK) / (vY * xK - vX * yK);
      return {
        res1: { x: vX * t, y: vY * t },
        res2: { x: Number.NaN, y: Number.NaN }
      };
    }

    const posByTime = (t: number) => ({
      x: vX * t,
      y: vY * t + (g * (t * t)) / 2.0
    })

    if (Math.abs(xK) > 1e-10) {
      const s = Math.sqrt((vY * vY) * (xK * xK) + (vX * vX) * (yK * yK) + g * (xK * xK) * yS * 2.0 - g * xK * xS * yK * 2.0 - vX * vY * xK * yK * 2.0);
      const t1 = (-vY * xK + vX * yK + s) / (g * xK);
      const t2 = -(vY * xK - vX * yK + s) / (g * xK);

      return {
        res1: posByTime(t1),
        res2: posByTime(t2)
      }
    }

    const t = xS / vX;
    return {
      res1: posByTime(t),
      res2: Vector2.Nan
    }
  }

  /**
   * Рассчитывает точку пересечения линии и траектории в 3D
   * @param velocity скорость снаряда
   * @param g гравитация
   * @param lineOrigin точка на линии
   * @param lineDirection направление линии
   */
  function intersectLineTrajectory3D(velocity: Vector3, g: number, lineOrigin: Vector3, lineDirection: Vector3): { res1: Vector3, res2: Vector3 } {
    const tracerDir = Vector3.normalize({ x: velocity.x, y: 0, z: velocity.z })

    const points = intersectLineTrajectory2D(
      projectPointOnPlane(velocity, Vector3.zero, tracerDir, Vector3.up),
      g,
      projectPointOnPlane(lineOrigin, Vector3.zero, tracerDir, Vector3.up),
      projectPointOnPlane(lineDirection, Vector3.zero, tracerDir, Vector3.up)
    );

    var tracerDirCross = Vector3.cross(tracerDir, Vector3.down);
    var xz1 = projectPointOnPlane({ x: points.res1.x, y: 0, z: 0 }, Vector3.zero, tracerDir, tracerDirCross);
    var xz2 = projectPointOnPlane({ x: points.res2.x, y: 0, z: 0 }, Vector3.zero, tracerDir, tracerDirCross);

    return {
      res1: { x: xz1.x, y: points.res1.y, z: xz1.y },
      res2: { x: xz2.x, y: points.res2.y, z: xz2.y }
    }
  }

  /**
   * 
   * @param options.gravity гравитация направленная **вверх**. Чтоб направить вниз, нужно использовать отрицательное значение
   * @param options.gunPos позиция оружия
   * @param options.markerPos позиция маркера
   * @param options.tracerStart начало трассера
   * @param options.tracerVelocity скорость трассера
   * @param options.dispersionAngle угол разброса
   * @returns Полярные координаты попадания снаряда внутри круга разброса
   */
  export function calculate(options: {
    gravity: number,
    shellSpeed: number,
    gunPos: Vector3,
    markerPos: Vector3,
    tracerStart: Vector3,
    tracerVelocity: Vector3,
    dispersionAngle: number
  }): Polar {
    const { gravity, shellSpeed, gunPos, markerPos, tracerStart, tracerVelocity, dispersionAngle } = options;

    var marker = Vector3.subtract(markerPos, gunPos);

    const trajectory = createTrajectory(marker, shellSpeed, gravity);

    const planeIntersection = Plane.intersection(
      { normal: Vector3.normalize(trajectory.targetNormal), point: markerPos },
      { normal: Vector3.normalize(Vector3.cross(Vector3.up, tracerVelocity)), point: tracerStart }
    );

    const lineIntersection = intersectLineTrajectory3D(tracerVelocity,
      gravity,
      Vector3.subtract(planeIntersection.point, tracerStart),
      planeIntersection.normal);


    const dist1 = Vector3.distance(markerPos, Vector3.add(lineIntersection.res1, tracerStart));
    const dist2 = Vector3.distance(markerPos, Vector3.add(lineIntersection.res2, tracerStart));
    if (Number.isNaN(dist1) && Number.isNaN(dist2)) throw new Error("Couldn't find intersection points");


    let nearestPoint = lineIntersection.res1;
    if (Number.isNaN(dist1)) nearestPoint = lineIntersection.res2;
    else if (Number.isNaN(dist2)) nearestPoint = lineIntersection.res1;
    else nearestPoint = dist1 < dist2 ? lineIntersection.res1 : lineIntersection.res2;

    nearestPoint = Vector3.add(tracerStart, nearestPoint);


    const markerRight = Vector3.normalize(Vector3.cross(Vector3.up, trajectory.velocity));
    const markerUp = Vector3.normalize(Vector3.cross(markerRight, trajectory.targetNormal));

    const posCart = projectPointOnPlane(nearestPoint, markerPos, markerRight, markerUp);

    const pos = cartesianToPolar(posCart);
    pos.r /= (dispersionAngle * trajectory.length);
    return pos;
  }
}

