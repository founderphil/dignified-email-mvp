/**
 * Gmail Workspace Add-on: calls backend and inserts/creates a draft.
 * Deploy: Deploy → Test deployments → Install (accept new scopes).
 */

const BACKEND = 'PUT YOURS HERE/v1/generate';

// Right-sidebar card (optional informational UI)
function buildAddOn(e) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle('Dignified Email'))
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(
          'Fill in details below to generate a dignified draft.'
        ))
        .addWidget(CardService.newTextInput()
          .setFieldName('purpose')
          .setTitle('Purpose (e.g., follow-up, intro, apology)')
        )
        .addWidget(CardService.newTextInput()
          .setFieldName('keyPoints')
          .setTitle('Key Points (comma separated)')
        )
        .addWidget(CardService.newTextInput()
          .setFieldName('recipientName')
          .setTitle('Recipient Name (optional)')
        )
        .addWidget(CardService.newSelectionInput()
          .setType(CardService.SelectionInputType.DROPDOWN)
          .setFieldName('tone')
          .setTitle('Tone')
          .addItem('Neutral', 'neutral', true)
          .addItem('Formal', 'formal', false)
          .addItem('Warm', 'warm', false)
          .addItem('Brief', 'brief', false)
        )
        .addWidget(CardService.newTextInput()
          .setFieldName('threadSummary')
          .setTitle('Thread Summary (optional)')
        )
        .addWidget(CardService.newTextButton()
          .setText('Generate Draft')
          .setOnClickAction(CardService.newAction()
            .setFunctionName('composeAction')
          )
        )
    );
  return [card.build()];
}

function composeAction(e) {
  let userEmail = 'User';
  try {
    userEmail = Session.getActiveUser().getEmail() || 'User';
  } catch (_) {}

  // Use sidebar input if available
  const payload = {
    userDisplayName: userEmail,
    purpose: e.formInput?.purpose || 'follow-up',
    tone: e.formInput?.tone || 'neutral',
    keyPoints: (e.formInput?.keyPoints || 'Brief check-in, Offer next steps').split(',').map(s => s.trim()),
    recipientName: e.formInput?.recipientName || undefined,
    companyStyle: undefined,
    threadSummary: e.formInput?.threadSummary || undefined
  };

  let res, code, text, data;
  try {
    res = UrlFetchApp.fetch(BACKEND, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      followRedirects: true,
      muteHttpExceptions: true
    });
    code = res.getResponseCode();
    text = res.getContentText();
  } catch (err) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText('Could not reach backend: ' + err.message))
      .build();
  }

  // Log backend response for debugging
  console.log('Backend response code:', code);
  console.log('Backend response text:', text);

  if (code !== 200) {
    let errorMsg = 'Backend error (' + code + ')';
    try {
      const errData = JSON.parse(text);
      if (errData && errData.error) errorMsg += ': ' + errData.error;
    } catch (_) {
      errorMsg += '. Body: ' + text.slice(0, 200);
    }
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText(errorMsg))
      .build();
  }

  try {
    data = JSON.parse(text);
  } catch (err) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText('Invalid backend response: ' + text.slice(0, 200)))
      .build();
  }

  const subject = data.subject || 'Re: follow-up';
  const body = data.body || '';

  if (CardService.newGmailDraft) {
    const draft = CardService.newGmailDraft()
      .setToRecipients('')
      .setSubject(subject)
      .setBody(body);
    return CardService.newComposeActionResponseBuilder()
      .setGmailDraft(draft)
      .build();
  }

  try {
    GmailApp.createDraft('', subject, body, { htmlBody: body });
  } catch (err) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText('Could not insert draft: ' + err.message))
      .build();
  }

  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText('Draft created in your Drafts folder.'))
    .build();
}