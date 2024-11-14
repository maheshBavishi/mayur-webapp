import React, { useEffect, useRef, useState } from "react";
import "./persönlicheDaten.scss";
import Logo from "../../../assets/images/child-logo.svg";
import {
  ApiGet,
  ApiGetNoAuth,
  ApiPost,
  ApiPut,
} from "../../../helpers/API/ApiData";
import profileimage from "../../../assets/images/profile_image.png";
import Select from "react-select";
import BarcodeIcon from "../../../assets/icon/barcode.png";
import { TailSpin } from "react-loader-spinner";
import uploadicon from "../../../assets/icon/upload-svgrepo-com 1.svg";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
// import Pdf from 'react-to-pdf';

export default function PersönlicheDaten() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [imageURL, setImageURL] = useState("");
  const [signatureURL, setSignatureURL] = useState(null);
  const [pdfProfile, setPdfProfile] = useState("");
  const [isModel, setisModel] = useState(false);
  const [postalCodeData, setPostalCodeData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pdfRef = useRef();
  const [loading, setLoading] = useState(false);
  const [userPostal, setuserPostal] = useState([]);
  const [showPostal, setShowPosatl] = useState();
  const [modalPostal, setModalPostal] = useState();

  const [inputField, setInputField] = useState({
    name: "",
    // nachname: "",
    gender: "",
    birthday: "",
    phone: "",
    email: "",
    userId: "",
    createdAt: "",
    streetHouseNumber: "",
    postalCode: "",
    location: "",
    patners: [],
    iban: "",
    creditInstitution: "",
    accountOwner: "",
    signature: signatureURL,
    profileImage: imageURL,
    PVVertrieb:false
  });
  const handlePage = () => {
    setPage((prev) => prev + 1);
  };
  const handleback = () => {
    setPage((prev) => prev - 1);
  };

  console.log("inputFieldddddddddddddd", inputField)

  useEffect(() => {
    if (inputField?.profileImage) {
      fetch(inputField?.profileImage)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setPdfProfile(url);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [inputField?.profileImage]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const fileType = files[0].type;
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(fileType) && name === "profileImage") {
        toast.error("Bitte laden Sie eine gültige Bilddatei hoch");
      } else {
        setInputField((prevState) => ({
          ...prevState,
          [name]: files[0],
        }));
        if (name === "profileImage") setImageURL(files[0]);
        if (name === "signature") setSignatureURL(files[0]);
      }
    } else if (!e.target.readOnly) {
      setInputField((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSpaceKeyPress = (event) => {
    if (
      event.key === " " &&
      event.target.selectionStart === 0 &&
      event.keyCode === 32
    ) {
      return event.preventDefault();
    }
  };
  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };
  const deleteSignatue = (e) => {
    setSignatureURL("");
    setInputField((prevState) => ({
      ...prevState,
      signature: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  const localData = JSON.parse(localStorage.getItem("userinfo"));
  const getData = async () => {
    try {
      let resp = await ApiGet(`user/get?userId=${localData?.userId}`);
     
      let postalAPIData =
        resp?.data?.payload?.data[0]?.PLZ?.length > 0
          ? resp?.data?.payload?.data[0]?.PLZ?.map((item) => item?._id)
          : [];
      setuserPostal(postalAPIData);
      setModalPostal(resp?.data?.payload?.data[0]?.PLZ);
      setShowPosatl(resp?.data?.payload?.data[0]?.PLZ);
      setInputField(resp?.data?.payload?.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const addPostalCode = () => {
    const formDataToSendNew = new FormData();
    setIsLoading(true);
    setInputField({ ...inputField, postalcodeArary: userPostal });
    let postal =
      userPostal?.length > 0
        ? userPostal?.map((item, i) => {
            formDataToSendNew.append(`PLZ[${i}]`, item);
          })
        : formDataToSendNew.append(`PLZ[]`, '');
        let data = inputField.patners?.map((item, i) => {
          formDataToSendNew.append(`patners[${i}]`, item?._id);
        });
    
    ApiPut(`user/update?id=${localData?._id}`, formDataToSendNew)
      .then((res) => {
        getData();
        toast.success("gespeichert");
        setisModel(!isModel);
        setIsLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setIsLoading(false);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("name", inputField?.name);
    formDataToSend.append(
      "vorname",
      inputField?.vorname ? inputField?.vorname : ""
    );
    formDataToSend.append(
      "nachname",
      inputField?.nachname ? inputField?.nachname : ""
    );
    formDataToSend.append("email", inputField?.email);
    formDataToSend.append("gender", inputField?.gender);
    formDataToSend.append("userId", inputField?.userId);
    formDataToSend.append("createdAt", inputField?.createdAt);
    formDataToSend.append("streetHouseNumber", inputField?.streetHouseNumber);
    formDataToSend.append("postalCode", inputField?.postalCode);
    formDataToSend.append("location", inputField?.location);

    let data = inputField.patners?.map((item, i) => {
      formDataToSend.append(`patners[${i}]`, item?._id);
    });

    formDataToSend.append("iban", inputField?.iban);
    formDataToSend.append("creditInstitution", inputField?.creditInstitution);
    formDataToSend.append("accountOwner", inputField?.accountOwner);
    formDataToSend.append("signature", inputField?.signature);
    formDataToSend.append("profileImage", inputField?.profileImage);
    formDataToSend.append("phone", inputField?.phone);
    formDataToSend.append("roleId", "65fc2112e8fe93f708e798c3");
    formDataToSend.append("steuernummer",inputField?.steuernummer?inputField?.steuernummer:"");
    formDataToSend.append("birthday",inputField?.birthday?inputField?.birthday:"");

    let postal =
      inputField?.postalcodeArary?.length > 0 
        ? inputField?.postalcodeArary?.map((item, i) => {
            formDataToSend.append(`PLZ[${i}]`, item);
          })
        : showPostal.length >0 ?     showPostal.map((item,i)=>{
          formDataToSend.append(`PLZ[${i}]`, item?._id) }) : formDataToSend.append(`PLZ[]`, []);;
       
    ApiPut(`user/update?id=${localData?._id}`, formDataToSend)
      .then((res) => {
        getData();
        toast.success("gespeichert");
        setIsLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isModel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  const downloadFile = (url) => {
    const name = url?.name;
    if (name) {
      const name = signatureURL?.name;
      const url = URL.createObjectURL(signatureURL);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], {
            type: "application/octet-stream",
          });
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          const filename = url.split("/").pop().split("?")[0];
          link.download = filename;
          link.click();
          URL.revokeObjectURL(blobUrl);
        }
      };
      xhr.open("GET", url);
      xhr.send();
    }
  };
  const downloadPdf = () => {
    const input = document.getElementById("pdf-container");

    const pdfWidth = 300;
    const pdfHeight = 125;

    const scale = 3;

    html2canvas(input, { scale: scale, useCORS: true }).then((canvas) => {
      const pdf = new jsPDF("l", "mm", "a4");

      const ratio = canvas.height / canvas.width;
      let pdfWidthActual = pdfWidth;
      let pdfHeightActual = pdfHeight;
      if (ratio < 1) {
        pdfHeightActual = pdfWidth * ratio;
      } else {
        pdfWidthActual = pdfHeight / ratio;
      }
      pdf.addImage(
        canvas.toDataURL("image/png", 1.0),
        "PNG",
        0,
        0,
        pdfWidthActual,
        pdfHeightActual
      );
      pdf.save(`${inputField?.name?.trim()}.pdf`);
    });
  };

  const OpenPostalModal = (data) => {
    setisModel(!isModel);
  };

  const getPostalCodeData = async () => {
    try {
      let body = {
        id: [],
      };
      setLoading(true);
      let response = await ApiPost(
        `vattenfall/getPostalcode?page=${page}&limit=10${
          search ? `&search=${search}` : ""
        }`,
        body
      );
      if (response?.data?.payload != {}) {
        setPostalCodeData(response?.data?.payload);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page == 1) {
      userPostal && getPostalCodeData();
    } else {
      getPostalCodeData();
    }
  }, [search, page]);

  const handleCheckBox = (item, id) => {
    setuserPostal((prevUserPostal) => {
      if (!prevUserPostal || prevUserPostal.length === 0) {
        return [id];
      } else if (prevUserPostal.includes(id)) {
        return prevUserPostal.filter((item) => item !== id);
      } else {
        return [...prevUserPostal, id];
      }
    });
    setModalPostal((prevPostal) => {
      if (!prevPostal || prevPostal.length === 0) {
        return [item];
      } else if (prevPostal.find((postalItem) => postalItem._id === id)) {
        return prevPostal.filter((postalItem) => postalItem._id !== id);
      } else {
        return [...prevPostal, item];
      }
    });
  };

  const removeItem = (newitem) => {
    setModalPostal((prevData) => {

      if (prevData.find((postalItem) => postalItem._id === newitem?._id)) {
        return prevData.filter((postalItem) => postalItem._id !== newitem?._id);
      }
    });

    setuserPostal((prevUserPostal) => {
     if (prevUserPostal.includes(newitem?._id)) {
        return prevUserPostal.filter((item) => item !== newitem?._id);
      } 
    });
  };
  return (
    <div className="persönlicheDaten-white-box">
      <div className="sub-box">
        <div className="sapcer">
          <h1>Persönliche Daten</h1>
          <div className="profile-details">
            <span className="flex-box">
              <p>Profilbild</p>
            </span>
            <div className="profile-image-button">
              {imageURL ? (
                <img
                  src={imageURL ? URL.createObjectURL(imageURL) : profileimage}
                />
              ) : (
                <img
                  src={
                    inputField?.profileImage !== "null"
                      ? inputField?.profileImage
                      : profileimage
                  }
                />
              )}

              {}
              <button>
                {" "}
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg, .gif, .bmp, .webp, .svg, .tiff, .ico"
                  name="profileImage"
                  onChange={handleChange}
                />{" "}
                Ändern
              </button>
            </div>
          </div>
          <div className="main-grid">
            <div className="main-items">
              <div className="two-col-grid">
                <div className="form-design">
                  <label>Vorname</label>
                  <input
                    type="text"
                    placeholder="Vorname"
                    name="vorname"
                    value={inputField?.vorname || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-design">
                  <label>Nachname</label>
                  <input
                    type="text"
                    placeholder="Nachname"
                    name="nachname"
                    value={inputField?.nachname || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-design">
                  <label className="required">Benutzername </label>
                  <input
                    type="text"
                    placeholder="Benutzername"
                    name="name"
                    value={inputField?.name || ""}
                    disabled
                  />
                </div>

                <div className="form-design">
                  <label>Geschlecht</label>
                  <div className="child-grid">
                    <div className="items">
                      <input
                        type="radio"
                        onChange={handleChange}
                        name="gender"
                        value="Männlicha"
                        checked={inputField.gender === "Männlicha"}
                      />
                      <p>Männlich</p>
                    </div>
                    <div className="items">
                      <input
                        type="radio"
                        name="gender"
                        value="Männlich"
                        checked={inputField.gender === "Männlich"}
                        onChange={handleChange}
                      />
                      <p>Weiblich</p>
                    </div>
                  </div>
                </div>
                <div className="form-design">
                  <label>Geburtstag</label>
                  <input
                    type="date"
                    placeholder="Geburtstag"
                    onKeyDown={handleSpaceKeyPress}
                    name="birthday"
                    value={inputField.birthday || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-design">
                  <label>Telefon</label>
                  <input
                    type="text"
                    placeholder="Telefon"
                    onKeyDown={handleSpaceKeyPress}
                    name="phone"
                    value={
                      inputField.phone === "undefined" ? "" : inputField.phone
                    }
                    onChange={(e) => handleChange(e)}
                    // onKeyPress={bindInput}
                  />
                </div>
                <div className="form-design">
                  <label className="required">E-mail</label>
                  <input
                    type="text"
                    placeholder="E-mail"
                    name="email"
                    value={inputField?.email || ""}
                    disabled
                  />
                </div>
                <div className="form-design">
                  <label className="required">WPDE Intern. No.</label>
                  <input
                    type="text"
                    placeholder="WPDE Intern. No."
                    name="userId"
                    value={inputField.userId || ""}
                    disabled
                  />
                </div>
                <div className="form-design">
                  <label className="required">Bei WePro seit</label>
                  <input
                    type="date"
                    placeholder="WPDE Intern. No."
                    name="beiWeProseit"
                    value={
                      inputField.createdAt
                        ? moment(inputField.createdAt).format("YYYY-MM-DD")
                        : ""
                    }
                    disabled
                  />
                </div>
               {inputField?.PVVertrieb && <div className="form-design">
                  <label>Gebiete für PV Vertrieb</label>
                  <input
                    type="text"
                    placeholder="Gebiete für PV Vertrieb"
                    name="beiWeProseit"
                    disabled
                    value={
                      showPostal?.length > 0
                        ? showPostal?.map((item) => item?.PLZ).join(", ")
                        : ""
                    }
                  />
                  <div className="edit-button-main">
                    <button onClick={() => OpenPostalModal()}>
                      {inputField?.PLZ?.length == 0
                        ? "Hinzufügen"
                        : "Bearbeiten"}
                    </button>
                  </div>
                  {isModel && (
                    <div className="edit-drop-down-main">
                      <div className="edit-drop-down-content-main">
                        <div className="edit-drop-down-content">
                          <div className="header-text">
                            Gebiete für PV Vertrieb
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <i
                              className="fa-sharp fa-solid fa-xmark"
                              onClick={() => {
                                setisModel(!isModel);
                                setSearch("");
                              }}
                            ></i>
                          </div>
                        </div>

                        <div className="edit-drop-down-body">
                          <div className="input-search">
                            <input
                              type="text"
                              placeholder="Suche"
                              value={search}
                              onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                              }}
                            />
                          </div>

                          <div className="postalcode-model-design">
                            <div className="modalPlzAlign">
                              {Array.isArray(modalPostal) &&
                                modalPostal.length > 0 &&
                                modalPostal?.map((item) => {
                                  return (
                                    <p>
                                      {item?.PLZ}{" "}
                                      <i
                                        onClick={() => removeItem(item)}
                                        class="fa-sharp fa-solid fa-xmark"
                                        style={{ color: "white" }}
                                      ></i>
                                    </p>
                                  );
                                })}
                            </div>
                          </div>

                          {Array.isArray(postalCodeData) &&
                          postalCodeData.length > 0 ? (
                            postalCodeData.map((item) => (
                              <div
                                className="checckbox-alignmnent"
                                key={item._id}
                              >
                                <input
                                  type="checkbox"
                                  checked={userPostal.includes(item._id)}
                                  onChange={() =>
                                    handleCheckBox(item, item._id)
                                  }
                                />
                                <p>
                                  {item.PLZ +
                                    ", " +
                                    item.ORT +
                                    ", " +
                                    item.ZUSATZ +
                                    " " +
                                    item.BUNDESLAND}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "40px",
                              }}
                            >
                              <p>Keine Postleitzahlendaten verfügbar</p>{" "}
                            </div>
                          )}
                        </div>

                        <div className="edit-drop-down-pagination">
                          <button onClick={() => addPostalCode()}>
                            {isLoading ? (
                              <TailSpin
                                color="#ffffff"
                                height={22}
                                width={22}
                                ariaLabel="loading"
                              />
                            ) : (
                              "Speichern"
                            )}
                          </button>

                          <div className="butoon-alignment">
                            {page !== 1 && (
                              <div className="previus" onClick={handleback}>
                                <i className="fa-solid fa-angle-left"></i>
                              </div>
                            )}

                            <div className="next" onClick={handlePage}>
                              <i className="fa-solid fa-angle-right"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>}
              </div>
              <div className="two-col-grid top-align">
                <div className="form-design">
                  <label>Straße und Hausnummer</label>
                  <input
                    type="text"
                    placeholder="Straße und Hausnummer"
                    name="streetHouseNumber"
                    value={
                      inputField?.streetHouseNumber === "undefined"
                        ? ""
                        : inputField?.streetHouseNumber || ""
                    }
                    onChange={handleChange}
                    onKeyDown={handleSpaceKeyPress}
                  />
                </div>
                <div className="sec-col">
                  <div className="form-design">
                    <label>Postleitzahl</label>
                    <input
                      type="text"
                      placeholder="Postleitzahl"
                      onKeyDown={handleSpaceKeyPress}
                      name="postalCode"
                      value={
                        inputField.postalCode === "undefined"
                          ? ""
                          : inputField.postalCode
                      }
                      onChange={(e) =>
                        e.target.value?.length <= 5 && handleChange(e)
                      }
                      onKeyPress={bindInput}
                    />
                  </div>
                  <div className="form-design">
                    <label>Ort</label>
                    <input
                      type="text"
                      placeholder="Ort"
                      onKeyDown={handleSpaceKeyPress}
                      name="location"
                      value={
                        inputField.location === "undefined"
                          ? ""
                          : inputField.location
                      }
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="main-items main-items-sc">
              <div className="form-design">
                <label className="required">Führungskraft</label>
                <input
                  type="text"
                  placeholder="Führungskraft"
                  name="patners"
                  value={inputField.patners
                    ?.map((item) => item.name)
                    .toString()}
                  disabled
                />
                <div className="image-position" onClick={downloadPdf}>
                  <i
                    class="fa-solid fa-download"
                    style={{ fontSize: "20px" }}
                  ></i>
                </div>
              </div>

              <div
                className="profile-child-box"
                id="pdf-container"
                ref={pdfRef}
              >
                <div className="imagebox">
                  <div>
                    <div className="relative-section">
                      {imageURL ? (
                        <img
                          src={URL.createObjectURL(imageURL)}
                          width="100px"
                          height="100px"
                        />
                      ) : (
                        <img
                          // src={
                          //   inputField?.profileImage !== "null" ||
                          //   !inputField?.profileImage
                          //     ? pdfProfile ?? inputField?.profileImage
                          //     : profileimage
                          // }
                          src={
                            inputField?.profileImage !== "null"
                              ? inputField?.profileImage
                              : profileimage
                          }
                          width="100px"
                          height="100px"
                        />
                      )}
                      <div className="liner"></div>
                    </div>
                    <p>{inputField.name}</p>
                    <span>Regionaler Vertrieb</span>
                  </div>
                  <div className="right-sider">
                    <a>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 50 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.46094 30.8486V3.15625L22.3071 30.8486V3.15625M33.0763 30.8486H46.5379M33.0763 11.4639C33.0763 13.6673 33.7855 15.7804 35.0477 17.3384C36.31 18.8964 38.022 19.7716 39.8071 19.7716C41.5922 19.7716 43.3042 18.8964 44.5665 17.3384C45.8287 15.7804 46.5379 13.6673 46.5379 11.4639C46.5379 9.26061 45.8287 7.14751 44.5665 5.58952C43.3042 4.03152 41.5922 3.15625 39.8071 3.15625C38.022 3.15625 36.31 4.03152 35.0477 5.58952C33.7855 7.14751 33.0763 9.26061 33.0763 11.4639Z"
                          stroke="white"
                          stroke-width="5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </a>
                    <a>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M49.6 16.4051L49.375 15.5051C49.0748 14.6318 48.6808 13.7936 48.2 13.0051C47.1023 11.1722 45.5304 9.6694 43.65 8.65511L30.525 1.55511C28.7894 0.631488 26.8535 0.148438 24.8875 0.148438C22.9215 0.148438 20.9856 0.631488 19.25 1.55511L6.125 8.65511C4.24463 9.6694 2.67274 11.1722 1.575 13.0051C1.08688 13.7861 0.700421 14.6262 0.425 15.5051V15.8551C0.14561 16.8563 0.00265186 17.8907 0 18.9301V37.9801C0.0066053 41.1275 1.25984 44.1441 3.4854 46.3697C5.71097 48.5953 8.72758 49.8485 11.875 49.8551H38.125C39.6845 49.8551 41.2286 49.5479 42.6694 48.9512C44.1101 48.3544 45.4192 47.4797 46.5219 46.377C47.6246 45.2743 48.4993 43.9652 49.0961 42.5245C49.6928 41.0837 50 39.5396 50 37.9801V18.9051C49.9554 18.06 49.8213 17.222 49.6 16.4051ZM28.95 24.7801C27.7108 25.4812 26.3113 25.8497 24.8875 25.8497C23.4637 25.8497 22.0642 25.4812 20.825 24.7801L4.5 15.3301C4.575 15.1401 4.6675 14.9551 4.775 14.7801C5.52951 13.5249 6.60925 12.497 7.9 11.8051L21.025 4.70511C22.206 4.06166 23.5301 3.72633 24.875 3.73011C26.2278 3.72642 27.56 4.06162 28.75 4.70511L41.875 11.8051C43.4194 12.64 44.6485 13.9569 45.375 15.5551L28.95 24.7801Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                    <a>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 53 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.960938 25.984C0.96409 19.0908 3.67952 12.4811 8.51009 7.6084C13.3407 2.73568 19.8908 -0.00106108 26.7202 3.08612e-07C40.9433 3.08612e-07 52.4795 11.636 52.4795 25.984C52.4795 36.68 47.177 45.156 41.4941 50.884C38.982 53.4306 36.1666 55.6529 33.1125 57.5C31.8364 58.26 30.6435 58.86 29.6052 59.268C28.6264 59.66 27.6 59.964 26.7202 59.964C25.8404 59.964 24.814 59.66 23.8352 59.268C22.623 58.7701 21.4505 58.179 20.3279 57.5C17.2739 55.6528 14.4585 53.4305 11.9463 50.884C6.26338 45.156 0.960938 36.68 0.960938 25.984ZM26.7202 15.988C24.0926 15.988 21.5726 17.0416 19.7146 18.9169C17.8566 20.7923 16.8128 23.3358 16.8128 25.988C16.8128 28.6402 17.8566 31.1837 19.7146 33.0591C21.5726 34.9344 24.0926 35.988 26.7202 35.988C29.3478 35.988 31.8678 34.9344 33.7258 33.0591C35.5838 31.1837 36.6276 28.6402 36.6276 25.988C36.6276 23.3358 35.5838 20.7923 33.7258 18.9169C31.8678 17.0416 29.3478 15.988 26.7202 15.988Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                    <a>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 46 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M31.6952 27.804L30.5683 28.9365C30.5683 28.9365 27.8858 31.6265 20.5667 24.2815C13.2476 16.9365 15.9301 14.2465 15.9301 14.2465L16.6384 13.5315C18.3896 11.7765 18.5555 8.95651 17.0273 6.89651L13.9065 2.68901C12.0142 0.139011 8.3608 -0.198488 6.19356 1.97651L2.3049 5.87651C1.23242 6.95651 0.514134 8.35151 0.600824 9.90151C0.823741 13.869 2.60212 22.4015 12.5194 32.3565C23.0386 42.9115 32.9089 43.3315 36.9437 42.9515C38.2217 42.8315 39.3314 42.1765 40.2255 41.2765L43.7426 37.7465C46.1204 35.364 45.4517 31.2765 42.4101 29.609L37.6793 27.0115C35.683 25.919 33.2556 26.239 31.6952 27.804Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="text-box">
                  <div className="child-log">
                    <img src={Logo} alt="Logo" />
                  </div>
                  <div className="text-grid">
                    <p>P.NR.</p>
                    <span>: {inputField?.userId}</span>
                  </div>
                  <div className="text-grid">
                    <p>E-mail</p>
                    <span>: info@wepro-deutschland.de</span>
                  </div>
                  <div className="text-grid">
                    <p>Addresse</p>
                    <span>: Alsterufer 20 in 20354 Hamburg</span>
                  </div>
                  <div className="text-grid">
                    <p>Telefon</p>
                    <span>: +49 172 44 65 322</span>
                  </div>
                  <div className="barcode-alignment">
                    <img src={BarcodeIcon} alt="BarcodeIcon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="new-grid">
            <div className="two-col">
              <div className="form-design">
                <label>IBAN</label>
                <input
                  type="text"
                  placeholder="Iban"
                  onKeyDown={handleSpaceKeyPress}
                  name="iban"
                  value={inputField.iban === "undefined" ? "" : inputField.iban}
                  onChange={handleChange}
                />
              </div>
              <div className="form-design new-align">
                <label>Kreditinstitut</label>
                <input
                  type="text"
                  placeholder="Kreditinstitut"
                  onKeyDown={handleSpaceKeyPress}
                  name="creditInstitution"
                  value={
                    inputField.creditInstitution === "undefined"
                      ? ""
                      : inputField.creditInstitution
                  }
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="upload-and-inp-grid-main">
              <div className="form-design new-align-left">
                <label>Kontoinhaber</label>
                <input
                  type="text"
                  placeholder="Kontoinhaber"
                  onKeyDown={handleSpaceKeyPress}
                  name="accountOwner"
                  value={
                    inputField.accountOwner === "undefined"
                      ? ""
                      : inputField.accountOwner
                  }
                  onChange={handleChange}
                />
              </div>
              <div className="upload-data">
                <label>Vertrag</label>
                <div className="upload-box-design">
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .pdf"
                    name="signature"
                    onChange={handleChange}
                    ref={fileInputRef}
                  />
                  <img src={uploadicon} width={10} height={10} /> hochladen
                </div>
              </div>
            </div>
          </div>
          <div className="new-grid">
            <div className="two-col">
              <div className="form-design">
                <label>Steuernummer</label>
                <input
                  type="text"
                  placeholder="Steuernummer"
                  onKeyDown={handleSpaceKeyPress}
                  name="steuernummer"
                  value={inputField?.steuernummer ? inputField.steuernummer: ""}
                  onChange={handleChange}
                />
              </div>
             
            </div>
           
          </div>
          <div className="upload-mx-main">
            <div className="upload-data-sc">
              <label>Vertrag</label>
              <div className="upload-box-design">
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg, .pdf"
                  name="signature"
                  onChange={handleChange}
                  ref={fileInputRef}
                />
                <img src={uploadicon} width={10} height={10} /> hochladen
              </div>
            </div>
            {inputField?.signature && inputField?.signature !== "undefined" ? (
              <div className="all-upload-data-alignment">
                <div className="box-design-style">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                  <span>Vertrag</span>
                  <div className="two-icon-alignment">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      onClick={(e) => downloadFile(inputField?.signature)}
                    >
                      <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      onClick={deleteSignatue}
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : signatureURL ? (
              <div className="all-upload-data-alignment">
                <div className="box-design-style">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                  <span>Vertrag</span>
                  <div className="two-icon-alignment">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      onClick={(e) => downloadFile(signatureURL)}
                    >
                      <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      onClick={deleteSignatue}
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          
          <div className="two-button-alignment">
            <button>Abbrechen</button>
            <button
              style={{ display: "flex", flexDirection: "row" }}
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {" "}
              Speichern{" "}
              {isLoading && (
                <TailSpin
                  color="#ffffff"
                  height={22}
                  width={22}
                  ariaLabel="loading"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
