
(function(){

	var NavSlip = function( ele , options ){

		if(!ele) return null;
		this.container = document.querySelectorAll(ele)[0];

		this.options = options || {};
		this.speed = this.options.speed || '0.3s';
		this.elastic = this.options.elastic || false;
		this.timing = this.options.timing || 'linear';

		this.params = this.initParam();

		this.initStyle();


		if (this.oTabUl.addEventListener) {

			this.oTabUl.addEventListener("touchstart", this, false);
	        this.oTabUl.addEventListener("touchmove", this, false);
	        this.oTabUl.addEventListener("touchend", this, false);
	        this.oTabUl.addEventListener("touchcancel", this, false);

		}

		this.container.addEventListener && this.container.addEventListener("touchmove",function(ev){ev.preventDefault();},false);
		
	};

	NavSlip.prototype={

		initParam:function(){
			return{
				startX : 0,	//	start×ø±ê
				moveX : 0,	// move×ø±ê
				endX : 0,	//	end×ø±ê
				differX : 0,// touch×ø±ê²îÖµ
				tempX : 0,//ÁÙÊ±¼ÇÂ¼×ø±ê
				transl : null //transform±äÁ¿
			}
		},

		initStyle:function(){

			this.oTabUl = this.container.querySelectorAll('ul')[0];
			this.oLi = this.container.querySelectorAll('li');
			this.liWidthArr = new Array();
			this.winWidth = +function(){
				if (window.innerWidth)
					return window.innerWidth;
				else if ((document.body) && (document.body.clientWidth))
					return document.body.clientWidth;
			}();

			for(var i=0; i<this.oLi.length; i++){
				this.liWidthArr.push(Math.ceil.call(null,this.getStyle(this.oLi[i],'width').match(/\d+/)[0]));
			};

			var reducer = function add(sumSoFar, item) { return sumSoFar + Math.ceil(item); };

			var total = this.liWidthArr.reduce(reducer, 0);

			this.limitWidth = total - this.winWidth;

			this.oTabUl.style.width = total+'px';
		},

		getStyle:function(obj,attr){
	  		return obj.currentStyle ? obj.currentStyle : document.defaultView.getComputedStyle(obj, null)[attr];
		},

		onStart:function( event ){
			var params = this.params,
				_this = this.oTabUl;

			params.startX = event.touches[0].pageX;
			_this.style.transition = null;
			if(params.moveX) params.moveX=0;
		},

		onMove:function( event ){
			event.stopPropagation();
			var params = this.params,
				_this = this.oTabUl;

			params.moveX = event.touches[0].pageX;
			params.differX = params.moveX - params.startX;
			params.tempX = params.differX + params.endX;

	
			if(this.elastic){
				if(params.tempX >= this.winWidth*0.5){
					params.tempX = this.winWidth*0.5;
					return false;
				}
				if(params.tempX <= -(this.limitWidth+this.winWidth*0.5)){
					params.tempX = -(this.limitWidth+this.winWidth*0.5);
					return false;
				}
				this.transformTime(params.tempX,_this);
			}

			else{
				if(params.tempX >= 0){
					return false;
				}
				if(params.tempX <= -this.limitWidth){
					return false;
				}
				this.transformLate(params.tempX,_this);
			}

		},

		onEnd:function( event ){
			var params = this.params,
				_this = this.oTabUl;

			params.endX = params.tempX;

			if(params.endX >= 0){
				params.endX = 0;
			}
			if(params.endX <= -this.limitWidth){
				params.endX = -this.limitWidth;
			}
			
			if(!this.elastic)
				this.transformLate(params.endX,_this) ;
			else 
				this.transformTime(params.endX,_this);

			return true;
		},

		transformLate:function(trans,obj){

			transl="translate3d("+trans+"px,0,0)";

			obj.style.transform = transl;
			obj.style.mozTransform = transl;
			obj.style.WebkitTransform = transl;
		},

		transformTime:function(trans,obj){
			obj.style.transition ='transform '+this.speed+' '+ this.timing;
			obj.style.mozTtransition ='transform '+this.speed+' '+ this.timing;
			obj.style.webkitTransition ='transform '+this.speed+' '+ this.timing;


			transl="translate3d("+trans+"px,0,0)";

			obj.style.transform = transl;
			obj.style.mozTransform = transl;
			obj.style.WebkitTransform = transl;
		},

		handleEvent:function( event ){
			switch (event.type){

				case 'touchstart':
					this.onStart(event);
					break;

				case 'touchmove':
					this.onMove(event);
					break;

				case 'touchend':
					this.onEnd(event);
					break;

			}
		}
	};
	
	var NavTouch = function(ele,options){

		return new NavSlip(ele,options);

	}; 
	
	window.NavTouch = NavTouch;

	
	
})();
