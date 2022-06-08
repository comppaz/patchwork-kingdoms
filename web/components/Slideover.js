import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image';

export default function Slideover({data}) {
  const [open, setOpen] = useState(true)
    console.log(open)
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
      <div className="fixed inset-y-0" />
        
        <div className="fixed inset-y-0 overflow-hidden">
          <div className="absolute inset-y-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-0 left-0 flex max-w-full pl-4 pt-24">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-full"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-full"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                <div className="flex h-fit flex-col bg-white py-6 rounded-lg shadow-xl">
                    <div className="px-4 sm:px-8">
                      <div className="flex items-start justify-between border-b-2 border-grey-100 pb-2">
                        <Dialog.Title className="text-xl font-bold text-teal-600"> {"#" + data?.name.split('#')[1]} </Dialog.Title>
                      </div>
                    </div>
                    <div className="relative mt-4 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="text-sm font-bold pb-4">
                          {data?.description.split('|')[0].trim() + '.'}
                      </div>
                      <div className="absolute inset-x-0">
                          <Image src={`https://patchwork-kingdoms.fra1.digitaloceanspaces.com/thumbnail/${data?.cluster_id}.png`} layout="responsive" height="50" width="50" objectFit='contain'/>
                          <div className="bg-teal-600 px-8 pt-6 pb-8 rounded-b-lg shadow-b-xl">
                                <h2 className="text-white font-bold text-2xl leading-7" >Connecting every school in the world to the internet</h2>
                                <p className="text-white font-medium text-sm leading-5 mt-2">
                                    Each Patchwork Kingdom tells a unique story on school connectivity. The artwork is data generated and based on the connectivity status of real schools spread all over the world. 
                                    Every square represents a real school with real students. Giga estimates that today, more than xx students in the world do not have access to reliable internet at school. 
                                    The Patchwork Kingdoms is an NFT project raising funds to help close the digital divide.
                                </p>
                          </div>
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}