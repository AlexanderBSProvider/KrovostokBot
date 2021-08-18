const telegramApi = require('node-telegram-bot-api')
const {gameOptions, againGameOptions} = require('./options')
const token = '1997656831:AAExWkyEPtuwPSuMvd4CUl60SD4imsIspWw'

const bot = new telegramApi(token, {polling:true})

const chat = {}

// const gameOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [
//                 {text:'1', callback_data: '1'},
//                 {text:'2', callback_data: '2'},
//                 {text:'3', callback_data: '3'},
//                 {text:'4', callback_data: '4'},
//                 {text:'5', callback_data: '5'}
//             ]
//         ]
//     })
// }
//
// const againGameOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [
//                 {text:'Играть еще раз', callback_data: '/again'}
//             ]
//         ]
//     })
// }

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Информация о пользователе'},
    {command: '/game', description: 'Угадать число'}
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадал цифру от 1 до 5, угадай ее!')
    const randomNumber = Math.floor(Math.random()*5+1)
    chat[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Выбери цифру', gameOptions)
}


bot.on('message', async msg => {

    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
        await bot.sendMessage(chatId, `Добро пожаловать в бот! Автор: Саня Кабан`)
        return bot.sendSticker(chatId,'https://cdn.tlgrm.app/stickers/69c/216/69c21694-1f7c-441e-a166-9ca08496ed03/96/2.webp')
    }
    if (text === '/info') {
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name === undefined ? ' ' : msg.from.last_name}`)
    }
    if (text === '/game') {
        return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Я не знаю такой комманды :(' )
})

bot.on('callback_query', async msg => {

    const chatId = msg.message.chat.id
    const data = msg.data

    if (data === '/again') {
        return startGame(chatId)
    }
    if (data == chat[chatId]) {
        return bot.sendMessage(chatId, `Ты угадал!`, againGameOptions)
    } else {
        return bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chat[chatId]}`, againGameOptions)
    }
})