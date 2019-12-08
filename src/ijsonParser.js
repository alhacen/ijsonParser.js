var ijsonParser=(function(){
    var json_map;
    var current_pos=0;
    var _terminate=[];                                     //points where array in json
    var _arry_terminate=[];                                //element count in array
    var destination_map_array=[];                          //convert destination map into array
    var result=[];
    var count=0;    
    return{
        next_result: function(index){
            if(index>=0){
                if(destination_map_array[_terminate[index]]!=_arry_terminate[index]-1){
                    destination_map_array[_terminate[index]]++;
                }else{
                    destination_map_array[_terminate[index]]=0;
                    this.next_result(index-1);
                }
            }
        },
        _window: function(name) {                                //it is like `window[]`, it evalueates string. i.e. "myjson[0]['key1'][0]['key2']" into myjson[0]['key1'][0]['key2']
            var parts = name.split(".");
            var n;
            var obj = window;
            for (n = 0; n < parts.length; ++n) {
                obj = obj[parts[n]];
                if (!obj) {
                    return;
                }
            }
            return obj ? obj : undefined;
        },
        parse: function(json,json_map){
             json_map;
            current_pos=0;
            _terminate=[];                                     //points where array in json
            _arry_terminate=[];                                //element count in array
            destination_map_array=[];                          //convert destination map into array
            result=[];
            count=0;
            json_map=json_map.split("->");                       //split into array
            var find=json_map[json_map.length-1];               //destination

            ijson=json;
            while(json_map[current_pos-1]!=find ){
                if(!Array.isArray(json)){                       //if current position in json is not array
                    json=json[json_map[current_pos]];           //
                    destination_map_array.push(json_map[current_pos]);  //
                    if(json_map[current_pos]==find){            //run loop if path is evaluated, i.e. myjson[0]['key1'][0]['key2']
                        for(i=0;i<_arry_terminate.reduce( (a,b) => a * b );i++){            //iterate loop for 
                            result.push(this._window("ijson."+ destination_map_array.join('.')));    //push into result
                            this.next_result(_arry_terminate.length-1);                          //
                        }
                        if(i==_arry_terminate.reduce( (a,b) => a * b)){return result;}      //if loop finishid return result
                    }
                    current_pos++
                }else{
                    _terminate.push(count);
                    _arry_terminate.push(json.length);
                    json=json[0];
                    destination_map_array.push(0);
                }
                count++;
            }   
        }
    }
})();