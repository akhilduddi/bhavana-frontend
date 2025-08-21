import React, { useEffect } from 'react';

const Chat = () => {
  useEffect(() => {
    // Add Zoho SalesIQ script to the document head
    const script1 = document.createElement('script');
    script1.innerHTML = 'window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.id = 'zsiqscript';
    script2.src = 'https://salesiq.zohopublic.in/widget?wc=siq8ef9fb9a675110c2621d34a7dcee1f67221f3c9c2799bca2300bf5acad69aebe';
    script2.defer = true;
    document.head.appendChild(script2);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1);
      }
      if (script2.parentNode) {
        script2.parentNode.removeChild(script2);
      }
    };
  }, []);

  return (
    <div className="chat-container">
      {/* This component just loads the Zoho SalesIQ script */}
      {/* The chat widget will appear automatically */}
    </div>
  );
};

export default Chat;
