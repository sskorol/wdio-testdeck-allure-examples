interface IAttachmentObject {
  content: string
  name: string
}

interface IAllureReporter {
  addStep: (title: string) => void
  addFeature: (featureName: string) => void
  addEnvironment: (name: string, value: string) => void
  addArgument: (name: string, value: string) => void
  addDescription: (description: string, type: string) => void
  addAttachment: (name: string, content: string, type?: string) => void
  addStory: (storyName: string) => void
  addSeverity: (severity: string) => void
  addIssue: (issue: string) => void
  addTestId: (testId: string) => void
}

declare const reporter: IAllureReporter
