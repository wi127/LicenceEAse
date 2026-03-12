import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Award, IdCard, Building, FileText, Wrench, Banknote, Calendar, Clock, FileCheck } from "lucide-react"

export default function ApplicationSteps() {
  const documents = [
    "📨 An application letter addressed to the Director General detailing the request",
    "🧾 A copy of the company registration certificate, including shareholding structure",
    "🪪 ID or passport of the legal representative of the company",
    "🏢 A company profile (nature and structure of the applicant — e.g. subsidiary, joint venture, etc.)",
    "📊 A business plan",
    "🛠️ A technical application"
  ]

  return (
    <section className="py-10">
      <div className="flex items-center gap-2 mb-6">
        <FileCheck className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-semibold">License Application Requirements</h2>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* 1. Required Documents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">6</div>
              <p className="text-xs text-muted-foreground">Documents needed</p>
              <p className="text-xs mt-2">📨 Application letter, 🧾 Company cert, 🪪 ID, 🏢 Profile, 📊 Business plan, 🛠️ Technical app</p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Payable Fee */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Banknote className="w-4 h-4" />
              Payable Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg font-bold text-primary mb-1">450 RWF</div>
              <p className="text-xs text-muted-foreground">Total fee (RWF)</p>
              <div className="text-xs mt-2 space-y-1">
                <p>App: 50 RWF</p>
                <p>License: 400 RWF</p>
                <p className="text-green-600">Same for renewal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. License Validity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              License Validity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">5</div>
              <p className="text-xs text-muted-foreground">Years</p>
              <p className="text-xs mt-2">📅 Valid from date of issue</p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Processing Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">5</div>
              <p className="text-xs text-muted-foreground">Days</p>
              <p className="text-xs mt-2">🕒 Maximum processing time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}