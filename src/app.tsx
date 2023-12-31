import { useEffect, useState, JSX, useReducer, useRef } from "uelements";
import SmallComponent from "./Components/SmallComponent";
import { mediaHandler } from "./reducers";
import { Crossicon, Muteicon, UnMuteicon } from "./assets/Icons";
// import { Fakedata } from "./data"
import ProductCard from "./Components/productcard";
import { MemoizedStoryDrawer } from "./Components/storydrawer/Storydrawer";

const mediaHandlerState = {
  toogleopen: false,
  videolength: null,
  ismute: false,
};

function App({ dataURL }: { dataURL: string }): JSX.Element {
  const [state, dispatch] = useReducer(mediaHandler, mediaHandlerState);
  const videoEl = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState({});
  const [dummy, setdummydata] = useState([] as any);
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setproductName] = useState("");

  const handlePopup = (event: MouseEvent): void => {
    dispatch({
      type: "SETTOGGLE",
      payload: undefined,
    });
  };

  const handleLoadedMetadata = () => {
    const video = videoEl.current!;
    if (!video) return;
    dispatch({ type: "SETVIDEOLENGTH", payload: video.duration });
  };

  async function handleData() {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

     
    try {
      const Store = await fetch(
        `https://shopify-shopclips.uakhui.easypanel.host/api/clips?filters[store][$contains]=${window?.Shopify?.shop?.split("myshopify.com")[0]}&populate=deep`,
        requestOptions
      );
      const data = await Store.json();
      const value = data?.data?.find(
        (data: any) =>
          data?.attributes?.clips?.[0].url === window.location.href.split("?")[0]
          // window.location.href 
          
      );
      console.log(JSON.stringify(value , null , 4), data, "productName");
      dataPrecessor(value);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  function dataPrecessor(value) {
    const video = value?.attributes?.clips[0]?.video
    const productNames = value.attributes.clips[0].tags.map((data: any) => {      
      return data.handle;
    });
    setData({  productNames , video});
    console.log(data , "data");
    
  }
  useEffect(() => {
    handleData();
  }, []);
  useEffect(() => {
    videoEl?.current?.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoEl?.current?.removeEventListener("timeupdate", () => setProgress(0));
    };
  }, [videoEl?.current]);

  const handleTimeUpdate = () => {
    if (!videoEl.current) return;
    const progress = (videoEl.current!.currentTime / state.videolength!) * 100;
    setProgress(progress);
  };

  const handleToogle = () => {
    if (!state.ismute) {
      videoEl.current!.muted = true;
    } else {
      videoEl.current!.muted = false;
    }
  };

  if (!data?.video) return <></> 

  if (state.toogleopen) {
    return (
      <div>
        <div className="overlay-thing"></div>
        <div className="video-box">
          {state.videolength ? (
            <>
              <div
                className="playbar"
                style={{
                  gridTemplateColumns: ` repeat($1 ,1fr)  `,
                }}
              >
                <div className="playbarinline__wrapper">
                  <div
                    style={{
                      display: "block !important",
                      transform: `scaleX(${progress / 100})`,
                    }}
                    className={`playbarinline   `}
                  ></div>
                  <div className="playbarinline__background"></div>
                </div>
              </div>
              <div className="muteop" onClick={handleToogle}>
                {!state.ismute ? <Muteicon /> : <UnMuteicon />}
              </div>
              <div className="crossiconop" onClick={handlePopup}>
                <Crossicon />
              </div>
            </>
          ) : (
            ""
          )}

          <video
            ref={videoEl}
            src={data?.video}
            // src={"https://d1b94xdk5eff5f.cloudfront.net/file_a86870a1f5.mp4"}
            onLoadedMetadata={handleLoadedMetadata}
            autoPlay
          />

          <div className="product-cards-container">
            <div className="product-cards">
              {data.productNames.map((data) => {
                 
                return (
                  <ProductCard
                    productname={data}
                    setIsOpen={setIsOpen}
                    setproductName={setproductName}
                  />
                );
              })}
            </div>
          </div>
          <div
        className={`f22storiesdrawer ${isOpen ? "f22open" : ""}`}
        onClick={() => {
          setIsOpen((prev) => !prev);
          // startProgress();
          // videoRef.current.play();
          // setIsSizeOpen(false);
        }}
      >
          <MemoizedStoryDrawer
            productname={productName}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          />
          </div>
        </div>
      </div>
    );
  }
  // if(!data) return <></>

  return (
    <>
      <SmallComponent
        video={data?.video}
        handlePopup={handlePopup}
      />
    </>
  );
}

export default App;
