
import DB from "./../../model/index"
import RedisData from "./../../../library/help/redisData";

import Error from "./../../../library/help/error";
const error = new Error("api/apiBiz");

const db = new DB("api/api");


//获取所有列表
const getList =  function (apiInfo) {
    var populate = function(param,sort,currentPage,pageSize){
        return db.find(param).populate({
            path:"productId",
            select:"name",
            match: { isDel:0}
        }).sort(sort).skip((currentPage) * pageSize).limit(pageSize)
    }


    return db.findByPage(apiInfo, {},{}, populate).then((data) => {
        return data;
    }).catch((err)=>{
        throw error.set(1, err.message);
    })
}

const pushRedis = function(){
    return db.find({$or:[{"todos.isGreatWall": true, "todos.isLogin": false}]}).then(data=>{
        let routes = {}
        data.map(obj => {
            routes[obj.url] = {
                isGreatWall: obj.isGreatWall,
                isLogin: obj.isLogin,
                isUse: obj.isUse,
                isRouter: obj.isRouter,
                version: obj.version
            }
        })
        let redisData = new RedisData("localConfig");
        return redisData.setProps("gateway.routes", routes, true);
    }).catch((err) => {
        return error.set(1, err.message); 
    })
}

export default  {
    getList,
    pushRedis
}