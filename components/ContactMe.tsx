import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import InputTemplate from "./Inputs/InputTemplate";
import InputText from "./Inputs/InputText";
import InputValue from "./Inputs/InputValue";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export interface ContactMeProps {}

export default function ContactMe(props: ContactMeProps) {
  const reCaptchaRef = useRef<ReCAPTCHA>(null);
  // TODO: Add Front-Back Communication
  return (
    <div className="bg-dark container-fluid d-flex justify-content-center py-5">
      <div className="custom-shape-divider-bottom-1636981473">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="shape-fill"
          ></path>
        </svg>
      </div>

      <div className="col-12 col-sm-11 col-md-10 col-lg-6">
        <h1
          className="text-center text-light font-weight-bold"
          style={{ letterSpacing: ".2rem" }}
        >
          CONTACT ME
        </h1>

        <form className="form-signin">
          <InputTemplate label="Email" labelClassName="text-light">
            <div className="input-group">
              <InputValue
                name="email"
                required
                value={""}
                className="rounded"
                placeholder="your@email.com"
                onChange={() => null}
              />
            </div>
          </InputTemplate>

          <InputTemplate label="Message" labelClassName="text-light">
            <InputText
              name="desc"
              required
              rows={5}
              value={""}
              placeholder="Your message..."
              onChange={() => null}
            />
          </InputTemplate>

          <ReCAPTCHA
            ref={reCaptchaRef}
            size="invisible"
            sitekey={publicRuntimeConfig.RECAPTCHA_INVISIBLE_SITE_KEY}
          />
          <div className="d-flex mt-4">
            <button type="submit" className="btn btn-lg btn-outline-light">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
