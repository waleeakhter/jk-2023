import React from "react";
import { Carousel, Image } from "antd";

import Datatable from "./components/Home/Datatable";

import { fetchItems } from "./lib/Data";

const contentStyle: React.CSSProperties = {
  height: "350px",
  color: "#fff",
  lineHeight: "350px",
  textAlign: "center",
  background: "#364d79",
  width: "100%",
};

const Home: React.FC = async () => {




  const data  =  await fetchItems()

  return (
    <>
      <Carousel autoplay style={{ maxWidth: 621, margin: "auto" }}>
        <div className=" text-center">
          <Image style={contentStyle} src="/realme c35.png"></Image>
        </div>
        <div className=" text-center">
          <Image style={contentStyle} src="/12mini.png"></Image>
        </div>
        <div className=" text-center">
          <Image style={contentStyle} src="/x5.png"></Image>
        </div>
        <div className=" text-center">
          <Image style={contentStyle} src="/realme10pro.png"></Image>
        </div>
      </Carousel>

        <Datatable loading={false} data={data ?? []} />
    </>
  );
};

export default Home;
