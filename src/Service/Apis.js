import { getDataWithOutToken } from "./service";

const postList=()=>getDataWithOutToken('posts')
export {postList}