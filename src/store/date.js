import { atom } from 'recoil';

export default atom({
    key : 'selectedDateState',
    default : new Date()
})