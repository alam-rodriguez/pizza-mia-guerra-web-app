import React, { useContext, useEffect, useState } from 'react';

// React Icon
import { FaWhatsapp } from 'react-icons/fa';
import { AiOutlineInstagram } from 'react-icons/ai';
import { RiFacebookCircleLine } from 'react-icons/ri';

// Component
import ContactUsItem from './ContactUsItem';

// Context
import { AppContext } from '../../../context/AppContext';

const ContactUs = () => {

	const { appInfo } = useContext(AppContext);

  const [facebook, setFacebook] = useState();
  const [instagram, setInstagram] = useState();
  const [whatsapp, setWhatsapp] = useState();

  useEffect(()=>{
    if(appInfo != null){
      setFacebook(appInfo.facebook);
      setInstagram(appInfo.instagram);
      setWhatsapp(appInfo.whatsapp);
    }
    console.log(<RiFacebookCircleLine className='display-4 me-1' />)
  }, [] );

  return (
    <section className='d-flex justify-content-around gap-2' style={{paddingBottom:70}}>

      <ContactUsItem
        icon={<RiFacebookCircleLine className='display-2 me-1' />} 
        title='Visitanos en' 
        appName='FACEBOOK' 
        link={facebook}
      />

      <ContactUsItem
        icon={<AiOutlineInstagram className='display-2 me-1' />} 
        title='Visitanos en' 
        appName='INSTAGRAM' 
        link={instagram}
      />

      <ContactUsItem
        icon={<FaWhatsapp className='display-2 me-1' />} 
        title='Visitanos en' 
        appName='WHATSAPP' 
        link={whatsapp}
      />
        
    </section>
  );
}

export default ContactUs;
