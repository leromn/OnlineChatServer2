const redux=require('redux');
const createStore=redux.createStore;

const initialState = {
    user: {},
    loggedIn: false,
    contacts: [{userName:'jjk',chatListTable:"2"},{userName:'jjk2',chatListTable:"12"}],
    pairedContact: { userName: "us", chatListTable: "clt" },
    num:0
  };
  
  function selector(num){
    const myContacts = initialState.contacts;
    console.log("cont",myContacts);
    var ret;
    myContacts.forEach(contact => {
        console.log(contact); 
        if(contact.one==num){
           console.log("found M@tch",contact)
            ret=contact
        }   
    })
    return ret;
  };
  function tableSelector(reciever){
    const myContacts = initialState.contacts;
    var ret={userName:reciever,chatListTable:"no"};
    myContacts.forEach(contact => {
      if(contact.userName){
        if(contact.userName==reciever){
            ret.chatListTable=contact.chatListTable
        }  
      } 
    })
    return ret;
  };

  function reducer(state = initialState, action) {
    switch (action.type) {

      case "PEER_REGISTER":
      const customPair = tableSelector(action.peer);
      return {
        ...state,
        pairedContact: customPair
      };

      default:
        return state;
    }
  }

  const store=createStore(reducer)
  console.log("init : ",store.getState())
  store.subscribe(()=>console.log("update : ",store.getState()))
  
  store.dispatch({type:"PEER_REGISTER",peer:'jjk2'})
