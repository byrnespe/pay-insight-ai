import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, CreditCard, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer_email: string | null;
  product_name: string | null;
  created_at: string;
}

interface RevenueData {
  mrr: number;
  totalRevenue: number;
  oneTimeRevenue: number;
  subscriptionRevenue: number;
  activeSubscriptions: number;
  recentTransactions: Transaction[];
}

interface RevenueMetricsProps {
  revenue: RevenueData | null;
}

function formatCurrency(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RevenueMetrics({ revenue }: RevenueMetricsProps) {
  if (!revenue) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Unable to load revenue data</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: "Monthly Recurring Revenue",
      value: formatCurrency(revenue.mrr),
      icon: TrendingUp,
      description: `${revenue.activeSubscriptions} active subscriptions`,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(revenue.totalRevenue),
      icon: DollarSign,
      description: "All-time earnings",
    },
    {
      title: "Subscription Revenue",
      value: formatCurrency(revenue.subscriptionRevenue),
      icon: CreditCard,
      description: "From recurring payments",
    },
    {
      title: "One-Time Revenue",
      value: formatCurrency(revenue.oneTimeRevenue),
      icon: Receipt,
      description: "From single purchases",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {revenue.recentTransactions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent transactions</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenue.recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(tx.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {tx.customer_email || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {tx.product_name || 'Unknown product'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(tx.amount, tx.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={tx.status === 'succeeded' ? 'default' : 'secondary'}
                        className={tx.status === 'succeeded' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : ''}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
