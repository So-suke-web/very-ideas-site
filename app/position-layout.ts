export type MapItem={id:string;title:string;number:number;archived?:boolean;assessment:{impact:number;feasibility:number}};
export type PlacedItem=MapItem&{x:number;y:number;anchorX:number;anchorY:number;width:number;height:number;lines:string[]};
export function positionLabels(items:MapItem[]):PlacedItem[]{
 const placed:PlacedItem[]=[];
 for(const item of [...items].sort((a,b)=>Number(b.assessment.impact!==3)-Number(a.assessment.impact!==3)||a.number-b.number)){
  const chars=Array.from(item.title);const lines:string[]=[chars.slice(0,12).join('')];for(let i=12;i<chars.length;i+=14)lines.push(chars.slice(i,i+14).join(''));
  const width=256,height=Math.max(66,lines.length*21+33);
  const anchorX=130+(item.assessment.feasibility-1)*315,anchorY=890-(item.assessment.impact-1)*200;
  let best:{x:number;y:number;cost:number}|undefined;
  for(let row=0;row<9;row++)for(let col=0;col<5;col++){
   const x=Math.max(162,Math.min(1358,170+col*295));
   const y=Math.max(100+height/2,Math.min(900-height/2,150+row*95));
   const overlap=placed.some(p=>Math.abs(x-p.x)<(width+p.width)/2+13&&Math.abs(y-p.y)<(height+p.height)/2+13);
   if(overlap)continue;
   const crossX=item.assessment.feasibility>3&&x-width/2<760||item.assessment.feasibility<3&&x+width/2>760;
   const crossY=item.assessment.impact>3&&y+height/2>490||item.assessment.impact<3&&y-height/2<490;
   if(crossX||crossY)continue;
   const cost=(x-anchorX)**2+(y-anchorY)**2;
   if(!best||cost<best.cost)best={x,y,cost};
  }
  // Current workspace fits without overlap; this fallback keeps future large sets accessible.
  if(!best)best={x:162+(placed.length%5)*278,y:100+height/2+Math.floor(placed.length/5)*130,cost:0};
  placed.push({...item,width,height,lines,x:best.x,y:best.y,anchorX,anchorY});
 }
 return placed.sort((a,b)=>a.number-b.number);
}
