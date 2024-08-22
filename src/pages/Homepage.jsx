import React from "react";
import { Carousel } from "flowbite-react";
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  let navigate = useNavigate();
  return (
    <div className="homepage h-screen w-screen">
    <Carousel className="h-full w-full relative z-10">
      
      {/* Slide 1 */}
      <div 
        className="relative flex h-full items-start justify-start p-8 bg-cover bg-center text-white z-20"
        style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1683309567810-4d232ee83d2f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
      >
        <button
          onClick={() => navigate('/todoList/register')}
          className="absolute top-4 right-4 px-4 py-2 me-10 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 z-30"
        >
          Skip
        </button>
        <div className="text-left mt-6 p-8 bg-black/50 rounded-lg w-full md:w-3/4 z-30">
          <h1 className="text-left text-5xl md:text-7xl font-bold">Welcome to My <span className="text-blue-600">TodoList Application</span></h1>
          <p className="text-2xl md:text-4xl mt-4">Manage your tasks efficiently and effectively with our powerful tools.</p>
        </div>
      </div>
  
      {/* Slide 2 */}
      <div className="relative flex h-full items-start justify-start p-8 bg-blue-600 z-20">
        <button
          onClick={() => navigate('/todoList/register')}
          className="absolute top-4 right-4 px-4 py-2 me-10 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 z-30"
        >
          Skip
        </button>
        <div
          className="w-80 h-80 bg-cover bg-center rounded-full z-30"
          style={{ backgroundImage: `url('https://th.bing.com/th/id/R.4da8b6e01b973e6b9288eb08b70cde76?rik=LSHNNP5zqDJlvQ&pid=ImgRaw&r=0')` }}
        />
        <div className="ml-8 text-white z-30">
          <h2 className="text-5xl md:text-6xl font-bold">Stay Organized</h2>
          <p className="text-2xl md:text-3xl mt-4">Keep track of all your tasks in one place, never miss a deadline!</p>
          <div className="mt-9">
            <h2 className="text-5xl md:text-6xl font-bold">Boost Your Productivity</h2>
            <p className="text-2xl md:text-3xl mt-4">Achieve more with less effort, our app makes it easy.</p>
          </div>
        </div>
      </div>
  
      {/* Slide 3 */}
      <div 
        className="relative flex h-full items-start justify-start p-8 bg-cover bg-center text-white z-20"
        style={{ backgroundImage: `url('https://th.bing.com/th/id/OIG4.iexbo93Bzhd3tka7ti3a?pid=ImgGn')` }}
      >
        <div className="text-left p-8 bg-black/50 rounded-lg w-full md:w-3/4 z-30">
          <h2 className="text-5xl md:text-6xl font-bold">Get Started Today</h2>
          <p className="text-2xl md:text-3xl mt-4 mb-6">Join us and take control of your tasks like never before.</p>
        </div>
        
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <button 
            onClick={() => navigate('/todoList/register')}
            className="px-5 py-4 bg-blue-600 font-bold lg:text-2xl lg:w-[500px] text-white rounded-lg shadow-lg transition duration-300 hover:bg-blue-800 w-[250px]"
          >
            Click to Get Started
          </button>
        </div>
      </div>
  
    </Carousel>
  </div>
  
  );
};

export default Homepage;
