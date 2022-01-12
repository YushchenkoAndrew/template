import {
  faChevronDown,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { Event } from "../../../pages/admin/projects/operation";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";

export interface ContainerProps {
  show?: boolean;
  offset: string;
  value: { [name: string]: any };
  onChange: (value: Event) => void;
}

export interface ContainerRef {}

export default React.forwardRef((props: ContainerProps, ref) => {
  const [minimized, onMinimize] = useState({
    resources: false,
    env: false,
  });

  const [env, onEnvAdd] = useState({} as { [name: string]: string });

  return (
    <div className={`border rounded mx-1 py-2 ${props.show ? "" : "d-none"}`}>
      <InputTemplate className="mx-3" label="Image">
        <div className="input-group">
          <InputName
            char="#"
            name={props.offset + ".image"}
            required
            value={props.value.image ?? ""}
            placeholder="grimreapermortis/void:0.0.2"
            onChange={props.onChange}
            // onBlur={onDataCache}
          />
        </div>
      </InputTemplate>

      <div className="row mx-1 w-100">
        <InputTemplate className="col-7" label="ImagePullPolicy">
          <InputRadio
            name="flag"
            placeholder={"IfNotPresent"}
            className="btn-group btn-group-sm btn-group-toggle"
            options={["IfNotPresent", "Always", "Never"]}
            label="btn-outline-info"
            onChange={(event) => {}}
          />
        </InputTemplate>

        <InputTemplate className="col-3" label="Port">
          <div className="input-group">
            <InputValue
              name="title"
              className="rounded"
              value={""}
              placeholder={"test"}
              onChange={() => null}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>
      </div>

      <InputTemplate
        className="mx-2"
        labelClassName="ml-2 mt-1"
        label={[
          "Resources ",
          <FontAwesomeIcon
            icon={minimized.resources ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({
            ...minimized,
            resources: !minimized.resources,
          })
        }
      >
        <div
          className={`row border rounded mx-2 py-2 ${
            minimized.resources ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6" label="CPU">
            <div className="input-group">
              <InputValue
                name="title"
                className="rounded"
                value={""}
                placeholder={"test"}
                onChange={() => null}
                // onBlur={onDataCache}
              />
            </div>
          </InputTemplate>
          <InputTemplate className="col-6" label="RAM">
            <div className="input-group">
              <InputValue
                name="title"
                className="rounded"
                value={""}
                placeholder={"test"}
                onChange={() => null}
                // onBlur={onDataCache}
              />
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="mx-2 mt-1"
        labelClassName="ml-2"
        label={[
          "env ",
          <FontAwesomeIcon
            icon={minimized.env ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({
            ...minimized,
            env: !minimized.env,
          })
        }
      >
        <div
          className={`border rounded mx-2 py-2 ${
            minimized.env ? "" : "d-none"
          }`}
        >
          <div className="mb-3 mx-3">
            <InputList
              char={["var", "="]}
              name={["name", "value"]}
              placeholder={["test", "test"]}
              onChange={(data) => {
                // if (!data["name"] || data["value"] === undefined) return false;
                onEnvAdd({ ...env, [data["name"]]: data["value"] });
                return true;
              }}
            />
            <ul className="list-group">
              {Object.entries(env).map(([name, value], i) => (
                <div key={i} className="row">
                  <ListEntity
                    char={["var", "="]}
                    value={[name, value]}
                    onChange={() => {
                      let temp = env;
                      delete temp[name];
                      onEnvAdd({ ...temp });
                    }}
                  />
                </div>
              ))}
            </ul>
          </div>
        </div>
      </InputTemplate>
    </div>
  );
});
