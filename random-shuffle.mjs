'use strict';

const { log, time, timeEnd } = console;

function* DelayGenerator () {

  let maxDelay    = 0;
  let stop        = false;

  const get = ( ) => Math.floor(Math.random() * 10000);
  const set = ($) => { 
    maxDelay = Math.max(maxDelay, $); 
    return $;
  };

  while(!stop) 
    stop = yield set(get())
  return maxDelay;

};

const delayGenerator = DelayGenerator();
const agents         = [{  name: "Roy"     },
                        {  name: "Aya"     },
                        {  name: "Eden"    },
                        {  name: "Simon"   },
                        {  name: "Daphna"  },
                        {  name: "Maikel"  }];

const asyncFn     = (ms, val) => new Promise((resolve) => setTimeout(() => resolve(val), ms));

const getDelay    = () => (({value} = delayGenerator.next(false)) =>  value        )();
const getMaxDelay = () => (({value} = delayGenerator.next(true )) => (value / 1000))();
const fetchAgents = () => agents.map((o) => { 
  
  const time = getDelay();
  return asyncFn(time, { ...o, time: String(time/1000 + "s") });

});

(async (items) => {

  log("Longest Operation: %ds", getMaxDelay());
  time("Time To Complete:");

  const result = await Promise.all(items);  
  
  timeEnd("Time To Complete:");  
  log(result);

})(fetchAgents())

