"use client";
import { useState } from "react";

export default function GovbrHowToDialog() {
  const [open, setOpen] = useState(false);
  const GOV = process.env.NEXT_PUBLIC_GOVBR_ASSINATURA_URL ?? "https://www.gov.br/governodigital/pt-br/assinatura-eletronica";
  const ITI = process.env.NEXT_PUBLIC_ITI_VALIDATOR_URL ?? "https://verificador.iti.gov.br/";

  return (
    <>
      <button className="btn-outline" onClick={()=>setOpen(true)}>Assinar pelo gov.br (guia)</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center p-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Assinar com gov.br</h2>
            <ol className="list-decimal pl-6 space-y-2 text-sm opacity-90">
              <li>Baixe o PDF do contrato.</li>
              <li>Acesse o portal do gov.br (conta <b>Prata</b> ou <b>Ouro</b>).</li>
              <li>Envie o PDF e conclua a assinatura.</li>
              <li>Baixe o PDF assinado e retorne aqui.</li>
              <li>Envie o PDF assinado no botão “Enviar PDF assinado”.</li>
              <li>(Opcional) Valide pelo verificador ITI.</li>
            </ol>
            <div className="flex gap-3">
              <a className="btn-outline" href={GOV} target="_blank">Ir para gov.br</a>
              <a className="btn-outline" href={ITI} target="_blank">Validador ITI</a>
              <button className="ml-auto btn" onClick={()=>setOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
