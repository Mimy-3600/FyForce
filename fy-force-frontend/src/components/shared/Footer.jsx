import { User } from 'lucide-react';
import Dock from '../Dock'
import { useNavigate } from 'react-router-dom';

export default function Footer({...props}) {
    const navigate = useNavigate()
    const items = [
    { icon: <User size={18} />, label: 'Home', onClick: () => navigate('/')},
    ];
    return(
        <div {...props}>
            <Dock 
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            />
        </div>
    )
}
