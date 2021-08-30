const c = require('config');
const { Router } = require('express');
const router = Router()


router.post('/send', async (req, res) => {
    try {

    }
    catch (e) {
        console.error(`send route error: ${e.message}`);
    }
    finally {
        return res.status(200).end()
    }
})


module.exports = router