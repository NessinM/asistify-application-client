import { SettingsPanelTrigger } from '@/providers/ticket.provider';
import { Button } from '@registry/default/ui/button';
import { ScrollArea } from '@registry/default/ui/scroll-area';
import { Code, Share2, Share, Sparkles, Paperclip, Mic, Leaf } from 'lucide-react';

import { ChatMessage } from '@components/ticket/chat-message.component';
import { useRef, useEffect } from 'react';

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, []);

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full  min-[1024px]:border-e bg-background">
      <div className="h-full flex flex-col pr-2 md:pr-3 lg:pr-4">
        {/* Header */}
        <div className="bg-background sticky justify-between top-0 z-10 h-15 flex  item-center ">
          <div className="leading-none justify-center flex flex-col">
            <h1 className="lg:text-xl md:text-md font-extrabold">#KL-20240609-2018-RND</h1>
            <div className="flex space-x-1 text-xs">
              <p className=" text-muted-foreground">Created:</p>
              <span className="font-medium">Santi contacted for the first time </span>
              <span className=" text-muted-foreground"> - 11:07 AM</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size={'sm'} variant="outline" className="px-2">
              <Code
                className="text-muted-foreground sm:text-muted-foreground/70 size-4"
                size={18}
                aria-hidden="true"
              />
              <span className="max-sm:sr-only">Code</span>
            </Button>
            <Button size={'sm'} variant="outline" className="px-2">
              <Share2
                className="text-muted-foreground sm:text-muted-foreground/70 size-4"
                size={18}
                aria-hidden="true"
              />
              <span className="max-sm:sr-only">Share</span>
            </Button>
            <Button variant="default" size={'sm'} className="px-2">
              <Share
                className="text-muted-foreground sm:text-muted-foreground/70 size-4"
                size={18}
                aria-hidden="true"
              />
              <span className="max-sm:sr-only">Export</span>
            </Button>
            <SettingsPanelTrigger />
          </div>
        </div>

        {/* Chat */}
        <div className="relative grow">
          <div className="max-w-3xl mx-auto mt-5 space-y-6">
            <div className="text-center my-8">
              <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
                <Sparkles
                  className="me-1.5 text-muted-foreground/70 -ms-1"
                  size={14}
                  aria-hidden="true"
                />
                Today
              </div>
            </div>
            <ChatMessage isUser>
              <p>Hey Bolt, can you tell me more about AI Agents?</p>
            </ChatMessage>
            <ChatMessage>
              <p>
                AI agents are software that perceive their environment and act autonomously to
                achieve goals, making decisions, learning, and interacting. For example, an AI agent
                might schedule meetings by resolving conflicts, contacting participants, and finding
                optimal times—all without constant supervision.
              </p>
              <p>Let me know if you&lsquo;d like more details!</p>
            </ChatMessage>
            <ChatMessage isUser>
              <p>All clear, thank you!</p>
            </ChatMessage>
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 pt-4 md:pt-8 z-50">
          <div className="max-w-3xl mx-auto bg-background rounded-[20px] pb-1 md:pb-2">
            <div className="relative rounded-[20px] border border-transparent bg-muted transition-colors focus-within:bg-muted/50 focus-within:border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
              <textarea
                className="flex sm:min-h-[84px] w-full bg-transparent px-4 py-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none [resize:none]"
                placeholder="Ask me anything..."
                aria-label="Enter your prompt"
              />
              {/* Textarea buttons */}
              <div className="flex items-center justify-between gap-2 p-3">
                {/* Left buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                  >
                    <Paperclip
                      className="text-muted-foreground/70 size-5"
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="sr-only">Attach</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                  >
                    <Mic className="text-muted-foreground/70 size-5" size={20} aria-hidden="true" />
                    <span className="sr-only">Audio</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                  >
                    <Leaf
                      className="text-muted-foreground/70 size-5"
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="sr-only">Action</span>
                  </Button>
                </div>
                {/* Right buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                      <g clipPath="url(#icon-a)">
                        <path
                          fill="url(#icon-b)"
                          d="m8 .333 2.667 5 5 2.667-5 2.667-2.667 5-2.667-5L.333 8l5-2.667L8 .333Z"
                        />
                        <path
                          stroke="#451A03"
                          strokeOpacity=".04"
                          d="m8 1.396 2.225 4.173.072.134.134.071L14.604 8l-4.173 2.226-.134.071-.072.134L8 14.604l-2.226-4.173-.071-.134-.134-.072L1.396 8l4.173-2.226.134-.071.071-.134L8 1.396Z"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="icon-b"
                          x1="8"
                          x2="8"
                          y1=".333"
                          y2="15.667"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#FDE68A" />
                          <stop offset="1" stopColor="#F59E0B" />
                        </linearGradient>
                        <clipPath id="icon-a">
                          <path fill="#fff" d="M0 0h16v16H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span className="sr-only">Generate</span>
                  </Button>
                  <Button className="rounded-full h-8">Ask Bart</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
