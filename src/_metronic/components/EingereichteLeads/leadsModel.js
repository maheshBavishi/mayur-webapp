import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { Modal } from "react-bootstrap";
import { Input, Label } from "reactstrap";
function AddMonestizel(props) {
    const { setNewModel, newmodel, updatedLead, updateLead, loading, handleChanges, error } = props

    return (
        <>
            <div className="modal-content new-width" style={{ width: "400px" }}>
                <Modal.Header
                    className="justify-content-start d-flex align-items-center"
                    closeButton
                >
                    <Modal.Title style={{ color: "#2c4570" }}>
                        Monatsziel            </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="row pb-5">
                        <div className="mr-8 col-12 col-md-12">
                            <Label className="form-label" for="monatsziel">
                                Monatsziel <span className="text-danger">*</span>
                            </Label>
                            <Input
                                className="p-3"
                                placeholder="Monatsziel"
                                name="monatsziel"
                                value={updatedLead}
                                onChange={(e) => handleChanges(e)}
                            />
                            <span className="errors">{error?.monestiziel}</span>
                        </div>


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="activebutton h-40px"
                        onClick={() => setNewModel(!newmodel)}
                        style={{ marginRight: "15px" }}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        className="addbutton"
                        onClick={updateLead}
                    >
                        <span> update</span>
                        {loading && (
                            <div class="h-20px spinner-border text-light w-20px ml-2"></div>
                        )}
                    </Button>
                </Modal.Footer>
            </div>
        </>
    );
}

export default AddMonestizel;
