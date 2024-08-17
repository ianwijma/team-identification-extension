import { Modal, ModalBody, ModalHeader } from "@nextui-org/react"

export const UnsupportedPopup = () => {
    return (
        <>
            <Modal className='rounded-none' isOpen={true}>
                <ModalHeader>
                    Please open a web page
                </ModalHeader>
                <ModalBody>
                    <p>
                        The current page you have focus is not supported.
                    </p>
                </ModalBody>
            </Modal>
        </>
    )
}