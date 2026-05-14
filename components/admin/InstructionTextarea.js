"use client";

import { useState, useRef } from "react";

export default function InstructionTextarea({ name, defaultValue = "", rows = 8, placeholder }) {
  const [value, setValue] = useState(defaultValue);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPosition);
      const textAfterCursor = value.substring(cursorPosition);
      
      const linesBeforeCursor = textBeforeCursor.split("\n");
      const currentLine = linesBeforeCursor[linesBeforeCursor.length - 1];
      
      let nextNumber = linesBeforeCursor.length + 1;
      
      const match = currentLine.match(/^(\d+)\./);
      if (match) {
         nextNumber = parseInt(match[1], 10) + 1;
      }

      const insertion = `\n${nextNumber}. `;
      const newValue = textBeforeCursor + insertion + textAfterCursor;
      
      setValue(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = cursorPosition + insertion.length;
          textareaRef.current.selectionEnd = cursorPosition + insertion.length;
        }
      }, 0);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (!pasteData) return;

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(e.target.selectionEnd);

    const pastedLines = pasteData.split(/\r?\n/).filter(line => line.trim() !== "");
    
    let formattedPaste = "";
    
    const linesBeforeCursor = textBeforeCursor.split("\n");
    let currentNumber = linesBeforeCursor.length; 
    
    const isLastLineEmptyBullet = textBeforeCursor.match(/(^|\n)(\d+)\.\s*$/);

    for (let i = 0; i < pastedLines.length; i++) {
      let line = pastedLines[i].trim();
      line = line.replace(/^\d+[\.\)]\s*/, "");

      if (i === 0) {
        if (isLastLineEmptyBullet) {
          formattedPaste += line;
        } else {
          if (textBeforeCursor === "") {
             formattedPaste += `1. ${line}`;
             currentNumber = 1;
          } else if (textBeforeCursor.endsWith("\n")) {
             currentNumber++;
             formattedPaste += `${currentNumber}. ${line}`;
          } else {
             formattedPaste += line;
          }
        }
      } else {
        currentNumber++;
        formattedPaste += `\n${currentNumber}. ${line}`;
      }
    }

    const newValue = textBeforeCursor + formattedPaste + textAfterCursor;
    setValue(newValue);

    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = textBeforeCursor.length + formattedPaste.length;
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
      }
    }, 0);
  };

  const handleFocus = () => {
    if (!value.trim()) {
      setValue("1. ");
    }
  };

  return (
    <textarea
      ref={textareaRef}
      name={name}
      rows={rows}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
      placeholder={placeholder}
    />
  );
}
