import React from 'react'
import BannerEditor from '../../Banner/BannerEditor'
import { useLocation, useParams } from 'react-router'

const PanoVerticalHorizontalPage = () => {
    const {panoId} = useParams()
    const token = localStorage.getItem("token");
    const userData = JSON.parse(atob(token.split(".")[1]));
    const location=useLocation();
    console.log(location.state);
    
    
  return (
    <div className='h-full w-full flex items-center justify-center bg-black'>

    {location.state=="yatay" && <BannerEditor userId={userData.id} panoId={panoId} isViewMode={false} orientation='horizontal' />}
    {location.state=="vertical" ? <BannerEditor userId={userData.id} panoId={panoId} isViewMode={false} orientation='vertical' />:<div className='text-white'>yoh</div>}
    </div>
  )
}

export default PanoVerticalHorizontalPage