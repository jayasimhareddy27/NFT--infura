const parseData=(NFTtransactions)=>{
    const Present_year =new Date().getFullYear();
    const TOTAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const Total_DAYS = Array(31).fill().map((v,i)=>i+1);
    
    const MONTHS=TOTAL_MONTHS.slice(0,new Date().getMonth()+1)
    const DAYS = Array(new Date().getDate()+1).fill().map((v,i)=>i+1);
    const YEARS = Array(5).fill().map((v,i)=>Present_year-i).reverse();
//frequence
    var M=[0,0,0,0,0,0,0,0,0,0,0,0];
    var D=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var Y=[0,0,0,0,0];
//price
    var P_M=[];
    var P_D=[];
    var P_Y=[];

    var max=-1;
    var min=100000;
    for (let index = 0; index < NFTtransactions.length; index++) {
        const month =new Date(NFTtransactions[index]?.timestamp).getMonth();
        const date =new Date(NFTtransactions[index]?.timestamp).getDate();
        const year =new Date(NFTtransactions[index]?.timestamp).getFullYear();
        const price=NFTtransactions[index]?.price;
        D[date]++;
        Y[Present_year-year+4]++;
        M[month]++;
        max=Math.max(price,max);
        min=Math.min(price,min);
        P_M.push({x:MONTHS[month],y:price})
        P_D.push({x:DAYS[date],y:price})
        P_Y.push({x:YEARS[Present_year-year+4],y:price})
    }
    const F={
        'MONTHS':{M,MONTHS,P_M},
        'DAYS':{D,DAYS,P_D},
        'YEARS':{Y,YEARS,P_Y}
    }
    
    return {F,max,min}
}
export default parseData;