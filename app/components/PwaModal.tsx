"use client"
import { Button } from 'antd'
import { Dialog } from 'primereact/dialog';
import React from 'react'

const PwaModal = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [prompt, setShowPrompt] = React.useState<any>(null);
    React.useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setShowPrompt(e);
            if (!window.matchMedia("(display-mode: standalone)").matches) {
                setShowModal(true);
            }
        };
       
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);
    const handleInstall = () => {
        if(prompt) {
            prompt.prompt();
            prompt.userChoice.then((choice: any) => {
                if (choice.outcome === "accepted") {
                    console.log("User accepted the install prompt");
                } else {
                    console.log("User dismissed the install prompt");
                }
                setShowPrompt(null);
                setShowModal(false);
            });
        }
    };
    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && <Dialog visible={showModal} onHide={handleClose} className='md:w-[500px] w-[90%]' >
                    <h2 className='text-xl font-bold mb-2'>Install the App</h2>
                    <p className='mb-4 text-sm'>
                        This app is available on your phone, tablet or computer.
                        To install it, tap the button below and follow the instructions.
                    </p>
                    <Button onClick={handleInstall}>
                        Install App
                    </Button>
            </Dialog>}
        </>
    )
}

export default PwaModal