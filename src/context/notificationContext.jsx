import React, { createContext, useState, useContext } from 'react';
const NotificatioContext = createContext();


const NotificationProvide = ({ children }) => {
    const [notificationNumber, setNotificationNumber] = useState(null);
    const[newLeadNumber,setNewLeadNumber]=useState(null)
  
    return (
      <NotificatioContext.Provider value={{ notificationNumber, setNotificationNumber,newLeadNumber,setNewLeadNumber }}>
        {children}
      </NotificatioContext.Provider>
    );
  };
  export { NotificatioContext, NotificationProvide };