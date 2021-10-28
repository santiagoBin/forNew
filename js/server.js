let users = [{id: 1001,name: "Santiago",email: "santiago@163.com"},{id: 1002 , name: "张三",email: "zhangsan@163.com"},{id: 1003 , name: "李四",email: "lisi@163.com"},{id: 1004 , name: "一乔",email: "yiqiao@163.com"},{id: 1005 , name: "二乔",email: "erqiao@163.com"},{id: 1006 , name: "三乔",email: "sanqiao@163.com"},{id: 1007 , name: "四乔",email: "siqiao@163.com"}];
let userli = JSON.stringify(users);
let page = 1;
localStorage.setItem("userlist", userli);
let id_no_use = [];//储存被删除用户的id，以赋予新用户。
Mock.mock('/login', 'post', (config) => {
	console.log(config);
	const obj = JSON.parse(config.body);
	let res = {};
	if (obj.email === "admin@163.com" && obj.password === "123") {
		res = {
			"code": 200,
			"message": "成功!",
			"result": {
				"apikey": "b9b3a96f7554e3bead2eccf16506c13e"
			}
		};
	} else {
		res = {
			"code": 400,
			"message": "登陆信息有误，请检查用户名及密码!",
			"result": null
		};
	}	
	return res;
})

Mock.mock('/getUserList', 'get', (config) => {
	let count = Math.floor(users.length/5);
	let rest = users.length%5;
	let res = [];
		if(page <= count){
			for(i = 0+(page-1)*5;i<0+page*5;i++){
				res.push(users[i]);
			}
		}else{
			if(rest == 0){//用户个数除以5余0时。
				page--;
			}
			for(i = 0+(page-1)*5;i<users.length;i++){
				res.push(users[i]);
			}
		}
		// let userlist = localStorage.getItem('userlist');
		// let json_userlist = JSON.parse(userlist);
		// console.log(json_userlist);
		return res;
})

//上一页
Mock.mock('/pre_userlist', 'get', (config) => {
	if(page == 1){
	}else{
		page--;
	}
})

//下一页
Mock.mock('/next_userlist', 'get', (config) => {
	let count = Math.floor(users.length/5);
	    if(page == count+1){
		}else{
			page++;
		}
})

Mock.mock('/saveUser', 'post', (config) => {
	//解析用户保存的数据
	// console.log(config);
	const obj = $.parseJSON(config.body);
	//构建一个空的对象
	let user = {};
	//往对象中添加数据
	if(id_no_use.length==0){//检查id_no_use数组中是否有删除用户可用的id
		user.id = users.length+1001;
	}else{
		user.id = id_no_use[0];
		id_no_use.splice(0,1);
	}
	user.name = obj.name;
	user.email = obj.email;
	users.push(user);
	function sortBy(props) {
		return function(a, b) {
			return a[props] - b[props];
		}
	}
	users.sort(sortBy("id"));
	// console.log(users);
	json_users = JSON.stringify(users);
	localStorage.setItem("userlist", json_users);
	// let userlist = localStorage.getItem('userlist');
	// let json_userlist = JSON.parse(userlist);
	// // console.log(json_userlist);
	// return json_userlist;
})

Mock.mock('/removeUser', 'post', (config) => {
	const obj = $.parseJSON(config.body);
	// console.log(obj);
	users.forEach(function(val,index){
		if(val.id==obj.index){
			users.splice(index,1);
		}
	})
	id_no_use.push(obj.index);
	id_no_use.sort();
	json_users = JSON.stringify(users);
	localStorage.setItem("userlist", json_users);
	// console.log(json_userlist);
})

Mock.mock('/update_user', 'post', (config) => {
	let obj = $.parseJSON(config.body);
	console.log(obj);
	// console.log(obj.index);
	// console.log(obj.index);
	users.forEach(function(val){
		if(val.id==obj.index){
			console.log(obj.index);
			if(obj.n_name ==""&& obj.n_email == ""){

			}else if(obj.n_email == ""){
				val.name = obj.n_name;
			}else if(obj.n_name ==""){
				val.email = obj.n_email;
			}else{
				val.name = obj.n_name;
				val.email = obj.n_email;
			}
		}
	})
	json_users = JSON.stringify(users);
	localStorage.setItem("userlist", json_users);
})

Mock.mock('/select_user', 'post', (config) => {
	const obj = $.parseJSON(config.body);
	// console.log(obj);
	let limit = obj.limit;
	let key = obj.key;
	let res = [];
	// console.log(obj.index);
	if(obj.limit =="id"){
		users.forEach(function(val,index){
			if(val.id==obj.key){
				res.push(val);
			}
		})
	}else if(obj.limit == "姓名"){
		users.forEach(function(val){
			if(val.name == key){
				res.push(val);
			}
		})
		
	}else if(obj.limit=="邮箱"){
		users.forEach(function(val){
			if(val.email == key){
				res.push(val);
			}
		})
		
	}
	return res;
})