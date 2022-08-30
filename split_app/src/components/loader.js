import { Dna } from  'react-loader-spinner'

export default function Loader() {
    return (
        <div className='text-center'>
            <Dna
            visible={true}
            height="100"
            width="100"
            ariaLabel="dna-loading"
            wrapperClass="dna-wrapper mx-auto my-4"
            />
        </div>
    );
  }
  