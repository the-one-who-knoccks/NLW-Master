import React from 'react';

interface HearderProps {
  title: string;
}

const Header: React.FC<HearderProps>  = (props) => {
  return (
    <header>
      <h1>{props.title}</h1>
    </header>
  );
}

export default Header;