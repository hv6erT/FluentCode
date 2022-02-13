//From: https://stackoverflow.com/questions/38400594/javascript-deep-comparison

export default function deepEqual(a,b){
  if( (typeof a == 'object' && a != null) && (typeof b == 'object' && b != null) ){
     let count = [0,0];
     for( const key in a) count[0]++;
     for( const key in b) count[1]++;
    
     if( count[0]-count[1] != 0) 
       return false;
    
     for(const key in a){
       if(!(key in b) || !deepEqual(a[key],b[key])) 
         return false;
     }
    
     for(const key in b){
       if(!(key in a) || !deepEqual(b[key],a[key])) 
         return false;
     }
    
     return true;
  }
  else
     return a === b;
}