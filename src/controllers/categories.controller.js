import {TJO} from '../utils/translateJsonHelper.js';
import axios from 'axios';
const getCategories = async (req, res) => {
   
    const language = req.params.language;
    const url = `https://opentdb.com/api_category.php`
    try {
    const response = await axios.get(url);
    const translateJson = await TJO.translate(response.data.trivia_categories, language);
    res.send({
        status: 'success',
        data: translateJson
    });
    } catch (error) {
        res.send({
            status: 'error',
            message: error.message
        })
    }
}

export default {
    getCategories
}