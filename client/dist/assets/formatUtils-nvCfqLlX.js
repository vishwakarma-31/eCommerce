const e=(r,n="USD")=>r==null?"$0.00":new Intl.NumberFormat("en-US",{style:"currency",currency:n,minimumFractionDigits:2,maximumFractionDigits:2}).format(r);export{e as f};
