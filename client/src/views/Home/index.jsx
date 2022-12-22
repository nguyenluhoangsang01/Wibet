import React, { useState } from "react";
import Loading from "../../components/Loading";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="-mx-4 sm:-mx-10 -my-6 h-[calc(100vh-60px*2)] relative">
      <img
        src="https://res.cloudinary.com/wibet/image/upload/v1671704020/images/home-bg_gocxql.webp"
        alt="home-background"
        className="w-full h-full"
      />

      <div className="bg-white rounded-md absolute top-[50px] inset-x-0 max-w-2xl mx-auto h-44 flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-6">
            <Loading color="black" />
            <Loading color="yellow" />
            <Loading color="grey" />
          </div>
        ) : (
          <p>Render data here</p>
        )}
      </div>
    </div>
  );
};

export default Home;
