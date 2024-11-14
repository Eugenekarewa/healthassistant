"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal"
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = "vertical", ...props }, ref) => {
    const [showScrollbar, setShowScrollbar] = React.useState(false)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const scrollbarRef = React.useRef<HTMLDivElement>(null)
    const [scrollbarTop, setScrollbarTop] = React.useState(0)
    const [scrollbarHeight, setScrollbarHeight] = React.useState(0)
    const [isDragging, setIsDragging] = React.useState(false)
    const [startY, setStartY] = React.useState(0)

    const updateScrollbar = React.useCallback(() => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = contentRef.current
        const scrollbarHeight = (clientHeight / scrollHeight) * clientHeight
        const scrollbarTop = (scrollTop / scrollHeight) * clientHeight

        setScrollbarHeight(scrollbarHeight)
        setScrollbarTop(scrollbarTop)
        setShowScrollbar(scrollHeight > clientHeight)
      }
    }, [])

    React.useEffect(() => {
      updateScrollbar()
      window.addEventListener("resize", updateScrollbar)
      return () => window.removeEventListener("resize", updateScrollbar)
    }, [updateScrollbar])

    const handleScroll = () => {
      updateScrollbar()
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true)
      setStartY(e.clientY - scrollbarTop)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && contentRef.current) {
        const newTop = e.clientY - startY
        const maxTop = contentRef.current.clientHeight - scrollbarHeight
        const boundedTop = Math.max(0, Math.min(newTop, maxTop))
        const scrollRatio = boundedTop / maxTop
        contentRef.current.scrollTop = scrollRatio * (contentRef.current.scrollHeight - contentRef.current.clientHeight)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    React.useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }, [isDragging, startY])

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div
          ref={contentRef}
          className="h-full w-full overflow-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          {children}
        </div>
        {showScrollbar && (
          <div
            ref={scrollbarRef}
            className={cn(
              "absolute right-0 top-0 h-full w-2 transition-opacity",
              orientation === "horizontal" && "bottom-0 left-0 h-2 w-full"
            )}
          >
            <div
              className="rounded-full bg-gray-400 opacity-50 transition-opacity hover:opacity-100"
              style={{
                height: orientation === "vertical" ? `${scrollbarHeight}px` : "100%",
                width: orientation === "horizontal" ? `${scrollbarHeight}px` : "100%",
                transform: `translate${orientation === "vertical" ? "Y" : "X"}(${scrollbarTop}px)`,
              }}
              onMouseDown={handleMouseDown}
            />
          </div>
        )}
      </div>
    )
  }
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }