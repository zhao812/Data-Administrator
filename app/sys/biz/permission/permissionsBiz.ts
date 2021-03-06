import {findUserByPerssions} from "./../../dao/permission/searchPermissionsDao";

import {each,isArray,isObjectLike} from "lodash";
import DB from "./../../model/index";
const db = new DB("permission/permissions");

import Error from "./../../../library/help/error";
const error = new Error("roleBiz");

import * as mongooseHelp from "./../../../library/help/mongoose";
import config from "../../routers/common/config";

//const 

export var getPermissions = function(userId){
    
    //let userId = "591d605257079155139b7229";
    return findUserByPerssions(userId).then((data)=>{
        ////console.log(data);
        let perssionsMap = {};
        
        let dataString = JSON.stringify(data);
        // //console.log(data);
        data = JSON.parse(dataString);
        
        let result = getNameByMap.init("permissions",data,"_id");
        //console.log("-----",result)
        
        return result;
        //591d605257079155139b7229

    })
}



var getNameByMap ={
    init:function(name,data,key){
        this.res = [];
        this.resMap = {};
        this.forEnd(name,data);
        
        let result = {}
        
        this.res.map(function(value,index){
            result[value[key]] = value;
            //resultArray.push(value._id);
        })
        
        let resultArray = [];
        each(result,function(value,key1){
            resultArray.push(value[key])
        })
        
        return resultArray;
        // //console.log("result",result);

    },
    forEnd:function(name,data){
        
        let _this= this;
        if(!isObjectLike(data)){
            return false;
        }
        each(data,function(value,indexAndkey){
            if(indexAndkey===name){
                _this.res = _this.res.concat(value);
                //_this.resMap[value._id] = value;
                // res[value._id] = value
            }else{
                _this.forEnd(name,value);
            }
        })
    }
}



//获取所有菜单
export const getList = function(permissions) {

    
    var populate = function(param,sort,currentPage,pageSize){
        return db.find(param).populate({
            path:"type",
            match: { isDel:0}
        }).sort(sort).skip((currentPage) * pageSize).limit(pageSize)
    }

    //模糊查询
    let like = config["permission/permissions"].like;
    permissions = mongooseHelp.getSearchKeyValue(permissions, like)

    return db.findByPage(permissions,{},{},populate).then((data:any) => {
                // ctx.body = result.success(data);
                return data;
            }) .catch((err) => {
        throw error.set(1, err.message);
    });
}
//getPermissions();