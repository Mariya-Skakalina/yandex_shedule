const express = require('express');
const cors  = require('cors'); //доступ к api
const request = require('request'); //запросы к другим ресурсам
const router = express.Router();

router.use(cors());
const api_key = '<KEY_YANDEX_API>';
// Отправление
router.get('/', async function(req, res) {
    await request(`https://api.rasp.yandex.net/v3.0/schedule/?apikey=${api_key}&station=s${req.param('st')}&transport_types=plane&event=${req.param('type')}&date=${new Date().toISOString()}`, { json: true }, (err, res2, body) => {
        if (err) { return console.log(err); }
        res.json(body);
    });
})
// Поиск
async function searchApi(search,req,offset,result){
    // Берем не более 500 offset-ов
    if (offset <= 500){
        await request(`https://api.rasp.yandex.net/v3.0/schedule/?apikey=${api_key}&station=s${req.param('st')}&transport_types=plane&date=${new Date().toISOString()}&offset=${offset}`, { json: true }, async (err, res2, body) => {
            if (err) { return console.log(err); }
            for await (let item of body.schedule){
                if (item.thread.number === search){
                    await result.schedule.push(item);
                } 
            }
            // Хотя-бы 1 совпадающий ответ
            if (result.schedule.length<1){
                await searchApi(search,req,offset+100,result)
            } else {
                return result
            }
        });
    }
    return false
    
}

router.get('/search', async function(req, res){
    let search = req.param('search'); // Поле поиска
    let result = {schedule:[]}; // Сюда сохраняем результат
    let max_time = 5 // Костыль, максимальное ожидаемое время для отдачи ответа(в секундах)
    let offset=0; // offset параметр API
    await searchApi(search,req,offset,result)
    setInterval(()=>{
        if (result.schedule.length>1 || max_time === 0)
            res.json(result)
        max_time -= 1;
    },1000)
    
})

module.exports = router;