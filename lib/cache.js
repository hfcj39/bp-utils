/**
 *cache
 * @param size
 * @param offset
 * @constructor
 */
function LRU_cache(size,offset) {
    this.size = size || 128;
    this.offset = offset || 9999;
    this.data = {}; //value数据
    this.hash = {}; //链表
    this.List = { //链表情况数据
        head:null,
        end:null,
        length:0
    };
    if(size<=0){
        this.size = 128;
    }
}


/**
 * 向缓存链表中加入键值对
 * @param key
 * @param value
 * @returns {LRU_cache}
 */
LRU_cache.prototype.set = function (key,value) {
    key = '_' + key;
    if(!key){
        throw 'set LRU_cache should have a key'; //如果没有key抛出异常
    }
    if(value === undefined){ //如果没有值
        return this
    }
    let temp = this.hash[key]; //在hash中寻找key
    if(!temp){
        this.hash[key] = {key:key,time:new Date().getTime()+this.offset};
        this.List.length += 1;
        temp = this.hash[key];
    }
    lru(this.List,temp);
    this.data[key] = new Buffer(JSON.stringify(value));
    if (this.List.length > this.size) this.remove(this.List.end.key.slice(1)); //插入时如果超出大小则删除最后一项
    return this;
};


/**
 * get
 * @param key
 * @returns {*}
 */
LRU_cache.prototype.get = function (key) {
    key = '_' + key;
    let temp = this.hash[key];
    if(!temp || temp.time < new Date().getTime()) {
        return null
    }else{
        lru(this.List,temp);
        return JSON.parse(this.data[key].toString());
    }
};


/**
 * delete
 * @param key
 * @returns {LRU_cache}
 */
LRU_cache.prototype.remove = function (key) {
    key = '_' + key;
    let lruEntry = this.hash[key];
    if (!lruEntry) return this;
    if (lruEntry === this.List.head) this.List.head = lruEntry.p;
    if (lruEntry === this.List.end) this.List.end = lruEntry.n;
    link(lruEntry.p, lruEntry.n);
    delete this.hash[key];
    delete this.data[key];
    this.List.length -= 1;
    return this;
};


/**
 * 把key提到链表head，即表示最新
 * @param linkedList
 * @param content
 */
const lru = (linkedList,content) => {
    if(content !== linkedList.head){ //如果条目不是链表头则进行处理
        if(!linkedList.end){ //如果不存在链表末尾，既链表中没有节点
            linkedList.end = content
        }else if(linkedList.end === content){ //如果是链表尾
            linkedList.end = content.n; //把上一节点放置到链表尾
        }
        link(content.p,content.n); //使上一项和下一项链接
        link(linkedList.head,content); //使此项和链表头链接
        linkedList.head = content;
        linkedList.head.n = null;
    }
};

/**
 * 链接两个链表对象
 * @param prevObj
 * @param nextObj
 */
const link = (prevObj,nextObj) => {
    if(prevObj !== nextObj){
        if(nextObj) nextObj.p = prevObj; //如果下一项不为空，下一项的前指针赋值为上一项
        if(prevObj) prevObj.n = nextObj;
    }
};


module.exports.LRU_cache = LRU_cache;
// let test = new LRU_cache();
// try{
//     test.set('user1', {name:'user', age: 31});
//     test.set('user2', {name:'user', age: 31});
//     test.set('user3', {name:'user', age: 31});
//     console.log(test.get('user1'))
// }catch (e){
//     console.log(e)
// }