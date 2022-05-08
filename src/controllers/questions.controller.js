import axios from 'axios'
import {TJO} from '../utils/translateJsonHelper.js';

  
const get_questions = async (req, res) => {
   const { category, difficulty, language } = req.body;
   
   const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
   
    try {
    const response = await axios.get(url);
    const translateJson = await TJO.translate(response.data.results, language);
    res.send({
        status: 'success',
        data: translateJson
        
    });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'error',
            message: error
        })
    }

}

export default {
    get_questions
}