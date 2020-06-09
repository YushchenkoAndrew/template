import torch
import torch.optim as optim
import torchvision
from torchvision import transforms, datasets
import torch.nn.functional as func
import matplotlib.pyplot as plt
from NeuralNetwork import *

trains = datasets.MNIST("", train=True, download=False,
                        transform=transforms.Compose([transforms.ToTensor()]))

test = datasets.MNIST("", train=False, download=False,
                      transform=transforms.Compose([transforms.ToTensor()]))

trainset = torch.utils.data.DataLoader(trains, batch_size=10, shuffle=True)
testset = torch.utils.data.DataLoader(test, batch_size=10, shuffle=True)

for data in testset:
    # print(data)
    break

x, y = data[0][0], data[1][0]

# Picture scale
print(x.shape)

net = Net()
print(net)

X = torch.rand((28, 28))
X = X.view(-1, 28 * 28)

output = net(X)
print(output)

# lr - it's leaning step
optimizer = optim.Adam(net.parameters(), lr=0.001)

TOTAL_EPOCH = 10

for epoch in range(TOTAL_EPOCH):
    for data in trainset:
        x, y = data
        # net.zero_grad()
        output = net(x.view(-1, 28 * 28))
        loss = func.nll_loss(output, y)
        loss.backward()
        optimizer.step()

    print(loss)


correct = 0
total = 0


with torch.no_grad():
    for data in trainset:
        x, y = data
        output = net(x.view(-1, 28 * 28))

        for idx, i in enumerate(output):
            if torch.argmax(i) == y[idx]:
                correct += 1
            total += 1

print('Accuracy: ' + str(round(correct / total, 3)))

plt.imshow(x[0].view(28, 28))
plt.show()

print(torch.argmax(net(x.view(-1, 28 * 28))[0]))
