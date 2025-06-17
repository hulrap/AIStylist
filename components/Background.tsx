import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-80"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/4245826/pexels-photo-4245826.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)'
        }}
      />
      {/* Blur Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed backdrop-blur-sm"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/4245826/pexels-photo-4245826.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)'
        }}
      />
    </div>
  );
}; 