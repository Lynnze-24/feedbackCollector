import { fUser } from "./user.service";

export const dummyUsers:fUser[] = [
    {
       name:'Brian James',
       avatar:'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
       email:'aunghtetlinn.yit@gmail.com',
       phone:'+9593338429',
       location:{
        city:'New York',
        country:'USA'
       },
       id: 'BJ12222',
       feedback:{
        name:'Brian James',
        rating: 1,
        reason: 'very fast',
        satisfactory:'Not at all',
        services: 'Delivery Service',
        social:[]
      }
    },
    {
      name:'Gareth Bale',
      avatar:'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
      email:'b@gmail.com',
      phone:'+9542211232',
      location:{
        city:'London',
        country:'England'
       },
      id: 'GB677777',
      feedback:null
   },
   {
    name:'Sara Lance',
    avatar:'https://images.unsplash.com/photo-1518577915332-c2a19f149a75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    email:'c@gmail.com',
    phone:'+9542689012',
    location:{
      city:'Berlin',
      country:'Germany'
     },
    id:'SL90922',
    feedback:null
 },
  {
    name:'Alex Kane',
    avatar:'',
    email:'alexKane98099@gmail.com',
    phone:'+9576288309',
    location:{
      city:'Yangon',
      country:'Myanmar'
     },
    id: 'AK990092282',
    feedback:null
},
  ];