import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { TERMINAL_COMMANDS } from '../data/terminalData';

interface InteractiveTerminalProps {
  onOpenEstimator: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  response: string[];
}

export const InteractiveTerminal = ({ onOpenEstimator }: InteractiveTerminalProps) => {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'lpb init',
      response: [
        '⚜️ LPB WEB STUDIO KERNEL [Version 2.4.0-PROD]',
        'Connected to Enterprise Node (TypeScript Engine Active)',
        'Escribe "help" o haz clic en los comandos rápidos para inspeccionar nuestra arquitectura.'
      ]
    }
  ]);

  const terminalLogsContainerRef = useRef<HTMLDivElement>(null);

  // Scroll ONLY the inner terminal log box, never the global window
  useEffect(() => {
    if (terminalLogsContainerRef.current) {
      terminalLogsContainerRef.current.scrollTop = terminalLogsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear' || trimmed === 'cls') {
      setLogs([]);
      setInputVal('');
      return;
    }

    if (trimmed === 'lpb quote' || trimmed === 'quote' || trimmed === 'cotizar') {
      onOpenEstimator();
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          response: ['✨ Abriendo el Cotizador Interactivo de Proyectos...']
        }
      ]);
      setInputVal('');
      return;
    }

    let response: string[] = [];
    const commandKey = trimmed.replace('lpb ', '');

    if (TERMINAL_COMMANDS[commandKey]) {
      response = TERMINAL_COMMANDS[commandKey];
    } else if (TERMINAL_COMMANDS[trimmed]) {
      response = TERMINAL_COMMANDS[trimmed];
    } else {
      response = [
        `Comando no reconocido: "${cmd}".`,
        'Escribe "help" para ver los comandos disponibles o "lpb stack".'
      ];
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        command: cmd,
        response
      }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  const quickCommands = ['lpb stack', 'lpb services', 'lpb status', 'lpb social', 'lpb quote', 'clear'];

  return (
    <section id="terminal" className="section-padding relative">
      <div className="container-lpb">
        <div className="section-header reveal-on-scroll">
          <div className="subtitle">Consola de Control</div>
          <h2 className="title">
            Arsenal & <span className="text-gold-gradient">TypeScript Kernel</span>
          </h2>
          <p className="description">
            Interactúa directamente con la consola de LPB WEB Studio para inspeccionar nuestro stack de desarrollo y filosofías de código.
          </p>
        </div>

        <div className="max-w-225 mx-auto bg-text-main rounded-3xl border border-slate-700/60 shadow-[0_25px_60px_rgba(15,23,42,0.18)] overflow-hidden reveal-scale">
          {/* Terminal Window Header */}
          <div className="px-6 py-3.5 bg-[#1e293b]/90 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-3 text-xs text-slate-400 font-['JetBrains_Mono']">
                lpb-studio-cli ~ bash (TypeScript 5.x)
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-['JetBrains_Mono']">
              <TerminalIcon size={14} />
              <span>LIVE_ENGINE</span>
            </div>
          </div>

          {/* Quick Command Chips */}
          <div className="px-6 py-3 bg-[#1e293b]/50 border-b border-slate-700/40 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Comandos rápidos:</span>
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-slate-700 rounded-md font-['JetBrains_Mono'] text-xs px-2.5 py-1 cursor-pointer transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Terminal Logs & Output (Internal Scroll Only) */}
          <div
            ref={terminalLogsContainerRef}
            className="p-6 min-h-65 max-h-95 overflow-y-auto font-['JetBrains_Mono'] text-sm leading-relaxed text-slate-200"
          >
            {logs.map((log) => (
              <div key={log.id} className="mb-4">
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="text-blue-400">lpb@studio:~$</span>
                  <span className="font-semibold text-white">{log.command}</span>
                </div>
                <div className="mt-1 text-slate-300 pl-4 border-l-2 border-amber-500/30">
                  {log.response.map((line, idx) => (
                    <div key={idx} className={line.startsWith('⚙️') || line.startsWith('🛡️') || line.startsWith('🟢') ? 'text-amber-400 font-medium' : 'text-slate-300'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal Input Bar */}
          <div className="px-6 py-3.5 bg-[#1e293b]/90 border-t border-slate-700/60 flex items-center gap-3">
            <span className="text-blue-400 font-['JetBrains_Mono'] font-bold">lpb@studio:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Escribe un comando (ej: "lpb stack", "help") y presiona Enter...'
              className="flex-1 bg-transparent border-none outline-none text-slate-100 font-['JetBrains_Mono'] text-sm"
              id="terminal-input"
            />
            <button
              onClick={() => executeCommand(inputVal)}
              aria-label="Ejecutar comando"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs font-['JetBrains_Mono'] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>ENTER</span>
              <CornerDownLeft size={12} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveTerminal;
