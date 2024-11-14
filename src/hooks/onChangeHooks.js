import { useState } from "react";

export const useOnChange = (initialValue) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [editorValue, setEditorValue] = useState({});

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errors, setErrors] = useState({});
  const handleChange = (e, type, content) => {
    if (type === "input") {
      const { name, value, checked } = e.target;
      if (name === "file") {
        setInputValue({ ...inputValue, [name]: e.target.files[0] });
        return;
      } else if (name === "imageFile") {
        setInputValue({ ...inputValue, [name]: e.target.files[0] });
      } else if (name === "logoFile") {
        setInputValue({ ...inputValue, [name]: e.target.files[0] });
      } else if (name === "termsAndCondition") {
        let val = checked ? true : false;
        setInputValue({ ...inputValue, [name]: val });
      } else if (name === "pincode") {
        if (value.length < 7) {
          setInputValue({ ...inputValue, [name]: value });
        }
      } else if (name === "EditortaskDetail") {
      } else if (name === "phone") {
        if (value.length < 11) {
          setInputValue({ ...inputValue, [name]: value });
        }
      } else if (name === "dob" || name === "email" || name === "mfgDate") {
        setInputValue({ ...inputValue, [name]: value });
      } else if (name === "carModel") {
        if (value === "new") {
          setInputValue({ ...inputValue, [name]: value, puc: "" });
        } else {
          setInputValue({ ...inputValue, [name]: value });
        }
      } else {
        // remove special characters and first space
        // let val = value.replace(/[^a-zA-Z0-9 ]/g, "").replace(/^\s+/, "");
        setInputValue({ ...inputValue, [name]: value });
      }
      setErrors({ ...errors, [name]: "" });
    } else if (type === "editorTaskDetail") {
      setEditorValue((pre) => {
        return { ...pre, editorTaskDetail: e };
      });
      setErrors((prev) => {
        return { ...prev, editorTaskDetail: "" };
      });
      // setEditorValue({ ...editorValue, EditortaskDetail: e });
    } else if (type === "offerDetail") {
      setEditorValue((pre) => {
        return { ...pre, offerDetail: e };
      });
      setErrors((prev) => {
        return { ...prev, offerDetail: "" };
      });
      // setEditorValue({ ...editorValue, offerDetail: e });
    } else if (type === "profileDetail") {
      setEditorValue((pre) => {
        return { ...pre, profileDetail: e };
      });
      setErrors((prev) => {
        return { ...prev, profileDetail: "" };
      });
      // setEditorValue({ ...editorValue, profileDetail: e });
    } else if (type === "file") {
      const { name } = e.target;
      setInputValue({ ...inputValue, [name]: e.target.files[0] });
    }
  };
  return {
    inputValue,
    setInputValue,
    errors,
    setErrors,
    handleChange,
    loadingUpload,
    setLoadingUpload,
    editorValue,
    setEditorValue,
  };
};
