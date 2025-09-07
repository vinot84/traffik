export function CitationDetailPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Citation Details</h1>
        <p className="text-muted-foreground">
          View and manage your citation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Citation Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Citation ID:</span>
                <span className="font-mono">#CIT-12345</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date Issued:</span>
                <span>March 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Unpaid</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Violations</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">Speeding</p>
                  <p className="text-sm text-muted-foreground">15 mph over limit</p>
                </div>
                <span className="font-semibold">$150.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">Failure to Signal</p>
                  <p className="text-sm text-muted-foreground">Lane change violation</p>
                </div>
                <span className="font-semibold">$75.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>$225.00</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span>$5.00</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>$230.00</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-primary text-primary-foreground p-3 rounded-md font-medium">
              Pay Now
            </button>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Options</h3>
            <div className="space-y-2">
              <button className="w-full p-2 text-left hover:bg-muted rounded-md">
                Contest Citation
              </button>
              <button className="w-full p-2 text-left hover:bg-muted rounded-md">
                Request Court Date
              </button>
              <button className="w-full p-2 text-left hover:bg-muted rounded-md">
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}