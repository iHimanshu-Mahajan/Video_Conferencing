'use client'

import { DeviceSettings, VideoPreview, useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import Alert from './Alert'
import { Button } from './ui/button'

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)

    const call = useCall()

    // Alert Logic: - (Added) 
    const { useCallEndedAt, useCallStartsAt } = useCallStateHooks()
    const callStartsAt = useCallStartsAt()
    const callEndedAt = useCallEndedAt()
    const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date()
    const callHasEnded = !!callEndedAt
    // Until this

    if(!call) {
        throw new Error('UseCall must be within StreamCall component')
    }

    useEffect(() => {
        if(isMicCamToggledOn) {
            call?.camera.disable()
            call?.microphone.disable()
        } else {
            call?.camera.enable()
            call?.microphone.enable()
        }
    }, [isMicCamToggledOn, call?.camera, call?.microphone])


    // Alert Logic: - (Added)
    if (callTimeNotArrived) {
        return (
            <Alert
                title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
            />
        )
    }

    if (callHasEnded) {
        return (
            <Alert
                title="The call has been ended by the host"
                iconUrl="/icons/call-ended.svg"
            />
        )
    }
    // Until this


    return (
        <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
            <h1 className='text-2xl font-bold'>Setup</h1>
            <VideoPreview />
            <div className='flex h-16 items-center justify-center gap-3'>
                <label className='flex items-center justify-center gap-2 font-medium'>
                    <input 
                        type='checkbox'
                        checked={isMicCamToggledOn}
                        onChange={(event) => setIsMicCamToggledOn(event.target.checked)}
                    />
                    Join with Mic and Camera Off
                </label>
                <DeviceSettings />
            </div>
            <Button 
                className='rounded-md bg-green-500 px-4 py-2.5' 
                onClick={() => {
                    call.join()

                    setIsSetupComplete(true)
                }}
            >
                Join meeting
            </Button>
        </div>
    )
}

export default MeetingSetup