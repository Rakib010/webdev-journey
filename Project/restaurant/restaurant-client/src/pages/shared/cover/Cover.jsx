import { Parallax } from "react-parallax";
const Cover = ({ img, title }) => {
  return (
    <div>
      <Parallax
        blur={{ min: -55, max: 55 }}
        bgImage={img}
        bgImageAlt="the dog"
        strength={-200}
      >
        <div
          className="hero h-[600px]"
          /* style={{
            backgroundImage: `url(${img})`,
          }} */
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">{title}</h1>
              <p className="mb-5">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
            </div>
          </div>
        </div>
      </Parallax>
    </div>
  );
};

export default Cover;
